import { ObjectId } from "mongodb";

export interface User {
  id: string; //s8041063
  name: string;
  joinedAt: string;
  password: string;
}
