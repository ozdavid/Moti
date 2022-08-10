import { Preference } from ".";

export interface UserPreferences {
    userId: string;
    preferences: Preference[];
}