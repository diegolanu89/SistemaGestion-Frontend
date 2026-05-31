export interface UserPermissionDto {
	permissionId: number
	permissionCode: string
	permissionName: string
	actionId: number
	actionCode: string
	level: number
}

export interface PermissionDto {
	id: number
	moduleId: number
	moduleCode: string
	name: string
	code: string
	description: string | null
	active: boolean
}

export interface ProfilePermissionActionDto {
	id: number
	code: string
	level: number
}

export interface ProfilePermissionItemDto {
	permissionId: number
	permissionCode: string
	moduleCode: string
	action: ProfilePermissionActionDto
}

export interface ProfilePermissionsResponseDto {
	profileId: number
	permissions: ProfilePermissionItemDto[]
}

export interface SyncProfilePermissionDto {
	permissionId: number
	actionId: number
}

export interface SyncProfilePermissionsDto {
	permissions: SyncProfilePermissionDto[]
}
export interface ProfileDto {
	id: number
	name: string
	code: string
	description: string | null
}

export interface CreateProfileDto {
	name: string
	code: string
	description?: string
}

export interface UpdateProfileDto {
	name?: string
	description?: string
}
