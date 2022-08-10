import { getCollection } from "../../utils/db";
import { UserPreferences } from "./user.preferences";


export class PreferencesDal {
    async getUsersPreferences(from: Date, until: Date): Promise<UserPreferences[]> {
        const collection = await getCollection(collectionName);
        return await collection.aggregate([
            {
                $match: {
                    $and: [
                        { date: { $gte: from } },
                        { date: { $lte: until } },
                    ]
                }
            }, {
                $group: {
                    _id: "$userId",
                    dates: { $push: "$date" }
                }
            }
        ]).toArray() as UserPreferences[];
    };

    async getAllUsersPreferences(): Promise<UserPreferences[]> {
        const collection = await getCollection(collectionName);
        return await collection.aggregate([{
            $group: {
                _id: "$userId",
                dates: { $push: "$date" }
            }
        }
        ]).toArray() as UserPreferences[];
    }

}

const collectionName = "preferences";