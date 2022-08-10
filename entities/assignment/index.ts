import { Slot } from "../slot";

export interface Assignment {
    slots: SlotAssignments[];
}

interface SlotAssignments extends Slot {
    assignedUsersIds: string;
}