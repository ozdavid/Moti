import moment from "moment";
import { createEmptyUserAssignmentsScores, UserAssignmentsScores } from "../history";
import { PreferencesDal } from "../preference/dal";
import { UserPreferences } from "../preference/user.preferences";
import { Slot } from "../slot";
import { SlotsDal } from "../slot/dal";
import { AssignmentHistory } from "./history";
import { AssignmentStrategy } from "./strategy";
import { IterativeAssignmentStrategy } from "./strategy.iterative";
import { groupBy } from 'ramda';

export class AssignmentsManager {
    constructor(
        private readonly slotsDal: SlotsDal,
        private readonly preferencesDal: PreferencesDal,
        private readonly usersDal: UsersDalp
    ) { };

    async createAssignment() {
        const now = moment();
        const currentWindowStart = now.startOf("month").toDate();
        const currentWindowEnd = now.endOf("month").toDate();

        const slots = await this.slotsDal.getSlots(currentWindowStart, currentWindowEnd);
        const currWindowPreferences = this.preferencesDal.getUsersPreferences(currentWindowStart, currentWindowEnd);
        const allUsersPreferences = await this.preferencesDal.getAllUsersPreferences();
        const usersScores = this.calculcateScores(slots, allUsersPreferences);

        const assignmentStrategy = new IterativeAssignmentStrategy(

        );
    }

    calculateScores(slots: Slot[], allPreferences: UserPreferences[]): UserAssignmentsScores[] {
        return allPreferences.map(userPrefs => {
            const amountsPerType = createEmptyUserAssignmentsScores(userPrefs.userId);
            userPrefs.dates.map(pref => {
                const currPrefSlotType = slots.find(slot => moment(slot.date).isSame(user)).type;
                amountsPerType[currPrefSlotType]++;
            });
        });
    }
}