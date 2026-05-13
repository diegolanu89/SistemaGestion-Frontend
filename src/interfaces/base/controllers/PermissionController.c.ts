// controllers/PermissionController.c.ts

import { IUser } from '../../Login/models/IUser.m'

export class PermissionController {
	static hasPermission(user: IUser | null, permissionCode?: string): boolean {
		if (!permissionCode) {
			return true
		}

		if (!user?.profilePermissions?.permissions) {
			return false
		}

		return user.profilePermissions.permissions.some((permission) => permission.permissionCode === permissionCode)
	}

	static hasModule(user: IUser | null, moduleCode?: string): boolean {
		if (!moduleCode) {
			return true
		}

		if (!user?.profilePermissions?.permissions) {
			return false
		}

		return user.profilePermissions.permissions.some((permission) => permission.moduleCode === moduleCode)
	}

	static hasLevel(user: IUser | null, permissionCode: string, minLevel: number): boolean {
		if (!user?.profilePermissions?.permissions) {
			return false
		}

		return user.profilePermissions.permissions.some((permission) => permission.permissionCode === permissionCode && permission.action.level >= minLevel)
	}
}
