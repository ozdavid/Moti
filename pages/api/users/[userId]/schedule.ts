import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";
import { UserAssignmentsHistoryDal } from "../../../../entities/assignment/history/dal";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { userId } = req.query;
    if (typeof userId === "string") {
        const assignmentsDal = new UserAssignmentsHistoryDal();
        const now = moment();
        const currentWindowStart = now.startOf("month").toDate();
        const currentWindowEnd = now.endOf("month").toDate();

        const userAssignments = await assignmentsDal.getAssignmentsHistoryOfUser(userId, currentWindowStart, currentWindowEnd);
        res.status(200).json(userAssignments);
    } else {
        res.status(400).send("");
    }
};