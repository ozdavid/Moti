import { NextApiRequest, NextApiResponse } from 'next';
import { getAllUsers } from '../../../entities/user/user.dal';

export default async (req:  NextApiRequest, res: NextApiResponse): Promise<void> => {
  const users = await getAllUsers();
  res.status(200).json(users)
};
