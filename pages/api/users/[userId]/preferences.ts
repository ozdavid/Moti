import moment from 'moment';
import { NextApiRequest, NextApiResponse } from 'next';
import { Preference } from '../../../../entities/preference';
import { PreferencesDal } from '../../../../entities/preference/dal';

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
        const preferences: Preference[] = JSON.parse(req.body);
        const parsedPreferences: Preference[] = preferences.map(pref => ({ date: new Date(pref.date), description: pref.description }));

        const preferecesDal = new PreferencesDal();
        await preferecesDal.submitPreferences(userId, parsedPreferences);

        res.status(200).send("");
    } else {
        res.status(400).send("");
    }
};

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
    const { userId } = req.query;
    if (typeof userId === "string") {
        const now = moment();
        const currentWindowStart = now.startOf("month").toDate();
        const currentWindowEnd = now.endOf("month").toDate();
        const preferecesDal = new PreferencesDal();
        const userPreferences = await preferecesDal.getUserPreferences(userId, currentWindowStart, currentWindowEnd);
        res.status(200).xjson(userPreferences);
    } else {
        res.status(400).send("");
    }
};