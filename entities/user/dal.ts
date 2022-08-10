import { getCollection } from "../../utils/db";
import { User } from "./user";

export class UsersDal {
    async getUser(userId: string): Promise<User | null> {
        const collection = await getCollection(collectionName);
        return await collection.findOne({ id: userId }) as User | null;
    }
    async getAll(): Promise<User[]> {
        const collection = await getCollection(collectionName);
        return await collection.find({}).toArray() as User[];
    }
}

const collectionName = "users";