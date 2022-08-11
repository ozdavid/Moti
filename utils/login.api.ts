import { User } from "../entities/user/user";

export const login = async (username, passphrase) => {
    const response = await fetch(`/api/users/${username}?passphrase=${passphrase}`);
    if (response.status !== 200) {
        throw new Error("Can't login");
    }
};

export const getAllUsers = async ():Promise<User[]> =>
    (await fetch("/api/users")).json();

export const getAllTeams = async () =>
    (await fetch("/api/teams")).json();
