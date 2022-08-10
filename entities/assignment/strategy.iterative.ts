import { Assignment } from ".";
import { UserAssignmentsScores } from "../history";
import { UserPreferences } from "../preference/user.preferences";
import { Slot } from "../slot";
import { AssignmentStrategy } from "./strategy";

export class IterativeAssignmentStrategy implements AssignmentStrategy {
    constructor(
        private readonly slots: Slot[],
        private readonly usersPreferences: UserPreferences[],
        private readonly history: UserAssignmentsScores[]
    ) { };
    assign(): Promise<Assignment> {

    }

}