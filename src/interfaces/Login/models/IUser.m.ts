export interface IUser {
	id: string
	email: string
	name: string

	role?: 'user' | 'admin'
	avatar?: string | null

	createdAt?: string | Date
}
