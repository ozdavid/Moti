import moment from "moment";
import { Assignment, SlotAssignments } from ".";
import { UserAssignmentsScores } from "../history";
import { UserPreferences } from "../preference/user.preferences";
import { Slot } from "../slot";
import { User } from "../user/user";
import { AssignmentStrategy } from "./strategy";

export class IterativeAssignmentStrategy implements AssignmentStrategy {
    constructor(
        private users: User[],
        private slots: Slot[],
        private usersPreferences: UserPreferences[],
        private history: UserAssignmentsScores[]) { };

    async assign(): Promise<Assignment> {
        const slotsSortedByPriority = this.sortSlotsbyPreferncesCoefficient(this.getPreferencesForAllSlots(this.getPreferencesNumberPerDate()));
        const assignments: SlotAssignments[] = [];
        slotsSortedByPriority.forEach((slot) => {
            const users = this.sortPotentialByHistoryAndPref(slot.slot);
            const assignedUsers = users.filter((user) => this.isUserAlreadyAssigned(user, assignments));
            const assignedUsersSortedByDate = this.sortAssignedUsersByDate(assignedUsers, assignments);
            const notAssignedUsers = users.filter((user) => !this.isUserAlreadyAssigned(user, assignments));
            const potential = notAssignedUsers.concat(assignedUsersSortedByDate);
            const assignedUserIdsToSlot: string[] = [];
            for (let i = 0; i < slot.slot.capcacity; i++) {
                assignedUserIdsToSlot.push(potential[i].id);
            }
            assignments.push({ ...slot.slot, assignedUsersIds: assignedUserIdsToSlot });
        });
        return { slots: assignments };
    }

    private getPreferencesForAllSlots(preferencePerDate: { slot: Slot, amount: number; }[]) {
        const finalPrefs = [];

        this.slots.forEach((slot) => {
            let find = false;
            preferencePerDate.forEach((currPref) => {
                if (slot.index == currPref.slot.index) {
                    finalPrefs.push(currPref);
                    find = true;
                }
            });

            if (!find) {
                finalPrefs.push({ "slot": slot, "amount": this.getAmountOfAvialbleUsers(0) });
            }
        });

        return finalPrefs;
    }

    private getPreferencesNumberPerDate(): { slot: Slot, amount: number; }[] {
        const allPreferences = this.usersPreferences.map(user => user.dates).flat();

        const amountOfPreferencesPerDate: Record<string, number> = allPreferences.reduce((acc, currPreference) => {
            if (!acc[currPreference.toISOString()]) {
                acc[currPreference.toISOString()] = 0;
            }

            acc[currPreference.toISOString()]++;

            return acc;
        }, {});

        return Object.entries(amountOfPreferencesPerDate).map(([dateString, amount]) => ({
            slot: this.slots.find(slot => slot.date.toISOString() == dateString),
            amount: this.getAmountOfAvialbleUsers(amount)
        }));
    }

    private getAmountOfAvialbleUsers(amount: number) {
        return this.users.length - amount;
    }

    private sortSlotsbyPreferncesCoefficient(amountOfPreferencesPerDate: { slot: Slot, amount: number; }[]): { slot: Slot, amount: number; }[] {
        return amountOfPreferencesPerDate.sort((a: { slot: Slot, amount: number; }, b: { slot: Slot, amount: number; }) => {
            return (a.amount / a.slot.capcacity) - (b.amount / b.slot.capcacity);
        });
    }

    private getAvailibleUsers(slot: Slot): User[] {
        return this.users.filter((user) => {
            if (this.isUserHasPref(user)) {
                return !this.isSlotInUserPref(user, slot);
            } else {
                return true;
            }
        });
    }

    private getUnavailibleUsers(slot: Slot): User[] {
        return this.users.filter((user) => {
            if (this.isUserHasPref(user)) {
                return this.isSlotInUserPref(user, slot);
            } else {
                return false;
            }
        });
    }

    private isSlotInUserPref(user: User, slot: Slot): boolean {
        const userPrefs = this.usersPreferences.find((pref) => {
            return pref.userId == user.id;
        });
        return userPrefs.dates.some(date => moment(date).isSame(slot.date));
    }

    private isUserHasPref(user: User): boolean {
        const prefsOfUser = this.usersPreferences.filter((pref) => {
            return pref.userId == user.id;
        });
        if (prefsOfUser.length == 0) return false;
        else return true;
    }

    private sortUsersByHistory(users: User[], slot: Slot): User[] {
        return users.sort((user1, user2) => {
            return this.getHistoryOfUser(user1)[slot.type] - this.getHistoryOfUser(user2)[slot.type];
        });
    }

    private getHistoryOfUser(user: User): UserAssignmentsScores {
        return this.history.find((u) => {
            return u.userId == user.id;
        });
    }

    private sortPotentialByHistoryAndPref(slot: Slot): User[] {
        const availibleUsers = this.getAvailibleUsers(slot);
        const unavailibleUser = this.getUnavailibleUsers(slot);
        const sortedAvailibleUsers = this.sortUsersByHistory(availibleUsers, slot);
        const sortedUnavailbleUsers = this.sortUsersByHistory(unavailibleUser, slot);
        return sortedAvailibleUsers.concat(sortedUnavailbleUsers);
    }

    private isUserAlreadyAssigned(user: User, assignments: SlotAssignments[]): boolean {
        return assignments.some(assignment => assignment.assignedUsersIds.includes(user.id));
    }

    private sortAssignedUsersByDate(users: User[], slots: SlotAssignments[]): User[] {
        return users.sort((user1, user2) => {
            const firstAssignment = this.findAssignmentOfUser(user1, slots);
            const secondAssignment = this.findAssignmentOfUser(user2, slots);
            return firstAssignment.date.getTime() - secondAssignment.date.getTime();
        });
    }

    private findAssignmentOfUser(user: User, slots: SlotAssignments[]) {
        return slots.find((slot) => 
            slot.assignedUsersIds.includes(user.id)
        );
    }

}
