import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";
import { groupBy } from "ramda";
import { UserAssignmentsHistoryDal } from "../../../entities/assignment/history/dal";
import { AssignmentsManager } from "../../../entities/assignment/manager";
import { SlotSchedule } from "../../../entities/assignment/schedule";
import { PreferencesDal } from "../../../entities/preference/dal";
import { SlotsDal } from "../../../entities/slot/dal";
import { UsersDal } from "../../../entities/user/dal";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method == "POST") {
        await handlePost(req, res);
    } else if (req.method == "GET") {
        await handleGet(req, res);
    } else {
        res.status(404).send("");
    }

};

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
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


const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
    const manager = new AssignmentsManager(
        new SlotsDal(),
        new PreferencesDal(),
        new UserAssignmentsHistoryDal(),
        new UsersDal()
    );

    const assignment =  await manager.createAssignment();
};