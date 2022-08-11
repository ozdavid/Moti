import { getCollection } from "../../utils/db";
import { User } from "./user";

const collectionName = "users";

export const getAllUsers = async () => {
  const users = (await (await getCollection(collectionName))
    .find({})
    .toArray()) as User[];
  return users;
};

export const signIn = async (
  id: string,
  password: string
): Promise<User | null> => {
  const user = (await getCollection(collectionName)).find({
    id,
  }) as unknown as User;
  return user.password == password ? user : null;
};
