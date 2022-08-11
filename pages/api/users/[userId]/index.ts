import { UsersDal } from "../../../../entities/user/dal";





export default async (req, res) => {
    if (req.query.userId) {
        const usersDal = new UsersDal();
        const user = await usersDal.getUser(req.query.userId);

        res.status(200).json(user);
    }
};
