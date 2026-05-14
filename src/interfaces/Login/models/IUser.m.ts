// models/IUser.m

export interface IUserPermissionAction {
	id: number
	code: string
	level: number
}

export interface IUserPermission {
	permissionId: number
	permissionCode: string
	moduleCode: string
	action: IUserPermissionAction
}

export interface IUserProfilePermissions {
	profileId: number
	permissions: IUserPermission[]
}

export interface IUser {
	id: string
	email: string
	name: string

	role?: string

	profileId?: number
	profileName?: string
	profileCode?: string

	profilePermissions?: IUserProfilePermissions

	avatar?: string | null

	createdAt?: string | Date
}
