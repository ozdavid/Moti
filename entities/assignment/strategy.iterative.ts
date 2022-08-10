import { PregnantWoman } from "@mui/icons-material";
import moment from "moment";
import { Assignment } from ".";
import { UserAssignmentsHistory } from "../history";
import { UserPreferences } from "../preference/user.preferences";
import { Slot } from "../slot";
import { User } from "../user/user";
import { AssignmentStrategy } from "./strategy";

export class IterativeAssignmentStrategy implements AssignmentStrategy {
    constructor(
        private readonly users: User[],
        private readonly slots: Slot[],
        private readonly usersPreferences: UserPreferences[],
        private readonly history: UserAssignmentsHistory[]
    ) { };
    assign(): Promise<Assignment> {
        const slotsSortedByPriority = this.sortSlotsbyPreferncesCoefficient(this.getPreferencesNumberPerDate());
        slotsSortedByPriority.forEach((slot) => {
            
        })
    }

    private getPreferencesNumberPerDate(): {slot: Slot, amount: number}[] {
        const allPreferences = this.usersPreferences.map(user=>user.dates).flat();
        const amountOfPreferencesPerDate: Record<string,number> = allPreferences.reduce((acc, currPreference) => {
            if(!acc[currPreference.toISOString()])
                acc[currPreference.toISOString()]=0;
            acc[currPreference.toISOString()]++;
            
            return acc
        },{});
        
        return Object.entries(amountOfPreferencesPerDate).map(([dateString, amount])=>({
            slot: this.slots.find(slot => slot.date.toISOString()==dateString),
            amount: this.getAmountOfAvialbleUsers(amount)
        }));
    }

    private getAmountOfAvialbleUsers(amount: number) {
        return this.users.length - amount
    }

    private sortSlotsbyPreferncesCoefficient(amountOfPreferencesPerDate: {slot: Slot, amount: number}[]): {slot: Slot, amount: number}[] {
        return amountOfPreferencesPerDate.sort((a: {slot: Slot, amount: number}, b: {slot: Slot, amount: number}) => {
            return (a.amount / a.slot.capcacity) - (b.amount / b.slot.capcacity);
        })
    }

    private getAvailibleUsers(slot: Slot): User[] {
        return this.users.filter((user) => {
            if (this.isUserHasPref(user)) {
                return !this.isSlotInUserPref(user, slot)
            } else {
                return true;
            }
        })
    }

    private getUnavailibleUsers(slot: Slot): User[] {
        return this.users.filter((user) => {
            if (this.isUserHasPref(user)) {
                return this.isSlotInUserPref(user, slot)
            } else {
                return false;
            }
        })
    }


    private isSlotInUserPref(user: User, slot: Slot): boolean {
        const userPrefs = this.usersPreferences.find((pref) => {
            return pref.userId == user.id;
        })
        return userPrefs.dates.some(date=> moment(date).isSame(slot.date))
    }

    private isUserHasPref(user: User): boolean {
       const prefsOfUser = this.usersPreferences.filter((pref) => {
            return pref.userId == user.id;
        })
        if (prefsOfUser.length == 0) return false;
        else return true;
    }

    private sortUsersByHistory(users: User[], slot: Slot): User[] {
        return users.sort((user1, user2) => {
            return this.getHistoryOfUser(user1)[slot.type] - this.getHistoryOfUser(user2)[slot.type]
        })
    }

    private getHistoryOfUser(user: User): UserAssignmentsHistory {
        return this.history.find((u) => {
            return u.userId == user.id
        })
    }

    private sortPotentialByHistoryAndPref(slot: Slot):  User[]{
        const availibleUsers = this.getAvailibleUsers(slot);
        const unavailibleUser = this.getUnavailibleUsers(slot);
        const sortedAvailibleUsers = this.sortUsersByHistory(availibleUsers, slot)
        const sortedUnavailbleUsers = this.sortUsersByHistory(unavailibleUser, slot)
        return sortedAvailibleUsers.concat(sortedUnavailbleUsers)
    }
}

