export interface UserPreference extends Preference {
    userId: string;
}

export interface Preference {
    date: Date;
    description?: string;
}