export interface IUser {
	id: string
	email: string
	name: string
	role?: string
	profileId?: number
	profileName?: string
	profileCode?: string
	avatar?: string | null
	createdAt?: string | Date
}
