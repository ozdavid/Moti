
export interface Slot {
    capcacity: number;
    date: Date;
    index: number; 
    type: SlotType;
}

export const slotTypes = [
    "weekend",
    "default"
] as const;
export type SlotType = typeof slotTypes[number];
