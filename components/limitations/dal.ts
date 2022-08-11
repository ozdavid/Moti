import { Limitation } from ".";
import { getCollection } from "../../utils/db";

export class LimitationsDal {
    async getUserLimitations(userId: string): Promise<Limitation[]> {
        const collection = await getCollection(collectionName);
        return await collection.find({ userId }).toArray() as Limitation[];
    }
    async addUserLimitations(userId: string, description: string) {
        const collection = await getCollection(collectionName);
        return await collection.insertOne({ userId, description });
    }
}

const collectionName = "limitations";