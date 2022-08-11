import { IterativeAssignmentStrategy } from "../../../entities/assignment/strategy.iterative";

export default async (req, res) => {

    const iterativeAssignmentStrategy = new IterativeAssignmentStrategy([],[],[],[]);
    res.status(200).send();
};