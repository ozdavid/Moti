import { SlotType } from "../slot";

export interface UserAssignmentsScores extends Record<SlotType, number> {
    userId: string;
}

export const createEmptyUserAssignmentsScores = (userId: string): UserAssignmentsScores => ({
    userId,
    default: 0,
    holiday: 0,
    weekend: 0
});