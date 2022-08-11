import { Slot } from "../slot";

export interface Assignment {
    slots: SlotAssignments[];
}

export interface SlotAssignments extends Slot {
    assignedUsersIds: string[];
}