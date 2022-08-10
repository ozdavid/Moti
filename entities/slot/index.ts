
export interface Slot {
    capcacity: number;
    date: Date;
    index: number; 
    type: SlotType;
}

export const slotTypes = [
    "weekend",
    "default",
    "holiday"
] as const;
export type SlotType = typeof slotTypes[number];
