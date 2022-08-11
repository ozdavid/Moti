import { NextApiRequest, NextApiResponse } from "next";
import { UserAssignmentsHistoryDal } from "../../../entities/assignment/history/dal";
import { AssignmentsManager } from "../../../entities/assignment/manager";
import { PreferencesDal } from "../../../entities/preference/dal";
import { SlotsDal } from "../../../entities/slot/dal";
import { UsersDal } from "../../../entities/user/dal";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const manager = new AssignmentsManager(
        new SlotsDal(),
        new PreferencesDal(),
        new UserAssignmentsHistoryDal(),
        new UsersDal()
    );

    const assignment = await manager.createAssignment();

    const assignmentsDal = new UserAssignmentsHistoryDal();
    
    await assignmentsDal.assign(assignment);
};