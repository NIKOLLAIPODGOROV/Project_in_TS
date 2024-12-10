export type UserInfoType = {
    userInfo?:  string | { [p: string]: string | null },
    name?: string | null,
    lastName?: string | null,
    id?: number | null,
    refreshToken?: string | null,
    accessToken?: string | null
}