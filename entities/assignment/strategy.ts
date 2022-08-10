import { Assignment } from ".";

export interface AssignmentStrategy {
    assign(): Promise<Assignment>;
}