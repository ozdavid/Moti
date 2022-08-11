import { AssignmentHistory } from ".";
import { Assignment } from "..";
import { getCollection } from "../../../utils/db";


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

    async getAssignmentsHistoryOfUser(userId: string, from: Date, until: Date) {
        const collection = await getCollection(collectionName);
        return await collection.find({
            userId,
            $and: [
                { date: { $gte: from } },
                { date: { $lte: until } },
            ]
        }).toArray() as AssignmentHistory[];
    }

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

    async assign(assignments: Assignment) {
        const assignmentsHistory: AssignmentHistory[] = assignments.slots.map(slot => slot.assignedUsersIds.map(userId => ({ userId, date: slot.date }))).flat();
        const collection = await getCollection(collectionName);
        collection.insertMany(assignmentsHistory);
    }
}

const collectionName = "assignments_history";

export interface UserAssignmentsHistory {
    userId: string;
    assignedAt: Date[];
}