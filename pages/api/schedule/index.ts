import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";
import { groupBy } from "ramda";
import { UserAssignmentsHistoryDal } from "../../../entities/assignment/history/dal";
import { SlotSchedule } from "../../../entities/assignment/schedule";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const assignmentsDal = new UserAssignmentsHistoryDal();
    const now = moment();
    const currentWindowStart = now.startOf("month").toDate();
    const currentWindowEnd = now.endOf("month").toDate();
    const assignmentsHistory = await assignmentsDal.getAssignmentsHistory(currentWindowStart, currentWindowEnd);

    const schedule: SlotSchedule[] = Object.entries(groupBy(assignment => assignment.date.toISOString(), assignmentsHistory)).map(([dateIso, slotAssignmentsHistories]) => ({
        date: new Date(dateIso),
        assignedUsersIds: slotAssignmentsHistories.map(assignment => assignment.userId)
    }));

    res.status(200).json(schedule);
};