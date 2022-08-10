import moment from "moment";
import { Slot } from ".";
import { getCollection } from "../../utils/db";

export class SlotsDal {
    async getSlots(from: Date, until: Date): Promise<Slot[]> {
        const collection = await getCollection(collectionName);
        return await collection.find({
            $and: [
                { date: { $gte: from } },
                { date: { $lte: until } },
            ]
        }).toArray() as Slot[];
    }
}

const collectionName = "slots";