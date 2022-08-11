import moment from 'moment';
import { NextApiRequest, NextApiResponse } from 'next';
import { LimitationsDal } from '../../../../components/limitations/dal';


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
    const { userId } = req.query;
    if (typeof userId === "string") {
        const description = req.body;
        const limitationsDal = new LimitationsDal();
        await limitationsDal.addUserLimitations(userId, description);
        res.status(200).send("");
    } else {
        res.status(400).send("");
    }
};

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
    const { userId } = req.query;
    if (typeof userId === "string") {
        const limitationsDal = new LimitationsDal();
        const limitations = await limitationsDal.getUserLimitations(userId);
        res.status(200).json(limitations);
    } else {
        res.status(400).send("");
    }
};