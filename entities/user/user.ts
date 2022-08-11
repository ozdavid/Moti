
export interface User {
    id: string;
    name: string;
    joinedAt: Date;
    role: UserRole;
    rank: string;
}

const userRoles = ["default", "admin"] as const;
type UserRole = typeof userRoles[number];