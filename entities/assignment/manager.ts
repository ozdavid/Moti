import moment from "moment";
import { Assignment } from ".";
import { createEmptyUserAssignmentsScores, UserAssignmentsScores } from "../history";
import { PreferencesDal } from "../preference/dal";
import { Slot } from "../slot";
import { SlotsDal } from "../slot/dal";
import { UsersDal } from "../user/dal";
import { User } from "../user/user";
import { UserAssignmentsHistory, UserAssignmentsHistoryDal } from "./history/dal";
import { IterativeAssignmentStrategy } from "./strategy.iterative";

export class AssignmentsManager {
    constructor(
        private readonly slotsDal: SlotsDal,
        private readonly preferencesDal: PreferencesDal,
        private readonly assignmentsHistoryDal: UserAssignmentsHistoryDal,
        private readonly usersDal: UsersDal
    ) { };

    async createAssignment(): Promise<Assignment> {
        const now = moment();
        const currentWindowStart = now.startOf("month").toDate();
        const currentWindowEnd = now.endOf("month").toDate();

        const slots = await this.slotsDal.getSlots(currentWindowStart, currentWindowEnd);
        const currWindowPreferences = await this.preferencesDal.getAllUsersPreferencesDuring(currentWindowStart, currentWindowEnd);

        const allUsers = await this.usersDal.getAll();

        const entireAssignmentsHistory = await this.assignmentsHistoryDal.getEntireAssignmentsHistoryPerUser();
        const usersScores = this.calculateScores(slots, entireAssignmentsHistory, allUsers);

        const assignmentStrategy = new IterativeAssignmentStrategy(
            slots, currWindowPreferences, usersScores
        );

        return assignmentStrategy.assign();
    }

    calculateScores(slots: Slot[], entireAssignmentsHistory: UserAssignmentsHistory[], allUsers: User[]): UserAssignmentsScores[] {
        const historicalAssignmentsAmountsPerUser: UserAssignmentsScores[] = entireAssignmentsHistory.map(userAssignments => {
            const amountsPerType = createEmptyUserAssignmentsScores(userAssignments.userId);
            userAssignments.assignedAt.forEach(prefDate => {
                const currPrefSlotType = slots.find(slot => moment(slot.date).isSame(prefDate)).type;
                amountsPerType[currPrefSlotType]++;
            });
            return amountsPerType;
        });

        return historicalAssignmentsAmountsPerUser.map(userAmounts => {
            const userJoinedAt = allUsers.find(user => user.id == userAmounts.userId).joinedAt;
            const amountOfMonthsSinceJoin = moment().diff(userJoinedAt, "months");
            return ({
                userId: userAmounts.userId,
                default: userAmounts.default / amountOfMonthsSinceJoin,
                holiday: userAmounts.holiday / amountOfMonthsSinceJoin,
                weekend: userAmounts.weekend / amountOfMonthsSinceJoin,
            });
        });
    }
}