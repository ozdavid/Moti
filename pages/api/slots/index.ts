import { NextApiRequest, NextApiResponse } from "next";
import { Slot } from "../../../entities/slot";
import { SlotsDal } from "../../../entities/slot/dal";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method == "POST") {
        await handlePost(req, res);
    } else if (req.method == "GET") {
        await handleGet(req, res);
    } else {
        res.status(404).send("");
    }

};


const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
    const slots: Slot[] = JSON.parse(req.body);
    const slotsDal = new SlotsDal();
    await slotsDal.addSlots(slots);
    res.status(200).send("");
};
const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.query.from && req.query.until) {
        const fromDate = new Date(req.query.from as string);
        const untilDate = new Date(req.query.until as string);
        const slotsDal = new SlotsDal();
        const slots = await slotsDal.getSlots(fromDate, untilDate);
        res.status(200).json(slots);
    } else {
        res.status(400).send("");
    }
};