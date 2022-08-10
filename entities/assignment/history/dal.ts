import { AssignmentHistory } from ".";
import { getCollection } from "../../../utils/db";
import { UserAssignmentsScores } from "../../history";


export class UserAssignmentsHistoryDal {
    async getAssignmentsHistory(from: Date, until: Date) {
        const collection = await getCollection(collectionName);

        return await collection.find({
            $and: [
                { date: { $gte: from } },
                { date: { $lte: until } },
            ]
        }).toArray() as AssignmentHistory[];
    };

    async getEntireAssignmentsHistoryPerUser(): Promise<UserAssignmentsHistory[]> {
        const collection = await getCollection(collectionName);

        return await collection.aggregate([
            {
                $group: {
                    _id: "$userId",
                    assignedAt: {
                        $push: "$date"
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    assignedAt: 1,
                    userId: "$_id",
                }
            }
        ]).toArray() as UserAssignmentsHistory[];
    };

}

const collectionName = "assignments_history";

export interface UserAssignmentsHistory {
    userId: string;
    assignedAt: Date[];
}