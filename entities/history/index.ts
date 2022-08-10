import { SlotType } from "../slot";


/**
 * 
 */
export interface UserAssignmentsHistory extends Record<SlotType, number> {
    userId: string;
}