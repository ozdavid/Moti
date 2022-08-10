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

    async calculateUsersAssignmentsScores ( ) :Promise<UserAssignmentsScores> {
        const collection = await getCollection(collectionName);

        return await collection.aggregate([
            {
                $group: {
                    _id: "userId",
                    
                }
            }
        ])
        
    }

}

const collectionName = "assignments_history";