import { NextApiRequest, NextApiResponse } from "next";
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


const handlePost = (req: NextApiRequest, res: NextApiResponse) => {

};
const handleGet = (req: NextApiRequest, res: NextApiResponse) => {
    if (req.query.from && req.query.until) {
        const fromDate = new Date(req.query.from)
        const slotsDal = new SlotsDal();
        // slotsDal.getSlots();
    } else {
        res.status(400).send("");
    }
};