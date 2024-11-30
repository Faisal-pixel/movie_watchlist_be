export type TUser = {
    id: number,
    username: string,
    firstname: string,
    lastname: string,
    profile_picture: string | null,
    password_hash: string,
    email: string,
    created_at: Date,
    last_login: Date | null,
    bio: string | null,
    notification_enabled: boolean
}