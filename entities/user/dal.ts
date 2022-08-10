import { getCollection } from "../../utils/db";
import { User } from "./user";

export class UsersDal {
    getUser(userId: string): Promise<User> {
        const collection = await getCollection(collectionName)
    }
}

const