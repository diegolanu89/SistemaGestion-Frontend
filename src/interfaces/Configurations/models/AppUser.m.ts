export interface ProfileDto {
	id: number
	name: string
	code: string
	description?: string | null
}

export interface AppUserDto {
	id: number
	name: string
	email: string
	profileId: number | null
	profileName: string | null
	profileCode: string | null
	active: boolean
}

export interface CreateAppUserDto {
	name: string
	email: string
	password: string
	passwordConfirmation: string
	profileId?: number | null
	active?: boolean
}

export interface UpdateAppUserDto {
	name?: string
	active?: boolean
	password?: string
	passwordConfirmation?: string
	profileId?: number | null
}
