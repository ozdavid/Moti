import { Preference, UserPreference } from ".";
import { getCollection } from "../../utils/db";
import { UserPreferences } from "./user.preferences";


export class PreferencesDal {
    async getAllUsersPreferencesDuring(from: Date, until: Date): Promise<UserPreferences[]> {
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

    async getAllPreferencesOfAllUsers(): Promise<UserPreferences[]> {
        const collection = await getCollection(collectionName);
        return await collection.aggregate([{
            $group: {
                _id: "$userId",
                dates: { $push: "$date" }
            }
        }
        ]).toArray() as UserPreferences[];
    }

    async getUserPreferences(userId: string, from: Date, until: Date): Promise<UserPreference[]> {
        const collection = await getCollection(collectionName);
        return await collection.find({
            userId,
            $and: [
                { date: { $gte: from } },
                { date: { $lte: until } },
            ]
        }).toArray() as UserPreference[];
    }
    
    async submitPreferences(userId: string, preferences: Preference[]) {
        const collection = await getCollection(collectionName);
        const userPreferences: UserPreference[] = preferences.map(pref => ({ userId, ...pref }));
        collection.insertMany(userPreferences);
    };

}

const collectionName = "preferences";