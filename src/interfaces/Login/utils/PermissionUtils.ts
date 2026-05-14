// utils/PermissionUtils.ts

import { IUser } from '../../Login/models/IUser.m'

export class PermissionUtils {
	// ==========================
	// 🔹 EXPECTED SYSTEM PERMISSIONS
	// ==========================

	private static readonly EXPECTED_PERMISSIONS: string[] = [
		'PROJECTS_ACCESS',
		'PROJECTS_ASSIGN',
		'PROJECTS_CREATE',

		'ETC_ACCESS',
		'ETC_EDIT',

		'ESTIMATED_PROJECTS_ACCESS',

		'DASHBOARD_EVM_ACCESS',
		'DASHBOARD_HOURS_ACCESS',

		'REPORTS_ACCESS',

		'ADMIN_ACCESS',

		'SETTINGS_ACCESS',
	]

	// ==========================
	// 🔹 VALIDATE PERMISSION
	// ==========================

	static hasPermission(user: IUser | null, permissionCode: string): boolean {
		if (!user?.profilePermissions?.permissions) {
			return false
		}

		return user.profilePermissions.permissions.some((permission) => permission.permissionCode === permissionCode)
	}

	// ==========================
	// 🔹 EXPECTED PERMISSIONS
	// ==========================

	static getExpectedPermissions(): string[] {
		return this.EXPECTED_PERMISSIONS
	}

	// ==========================
	// 🔹 PRINT CONSOLE TABLE
	// ==========================

	static printPermissionsTable(user: IUser): void {
		if (!user.profilePermissions?.permissions?.length) {
			console.warn('[AUTH] No permissions assigned')

			return
		}

		const table = this.EXPECTED_PERMISSIONS.map((permissionCode) => {
			const permission = user.profilePermissions?.permissions.find((item) => item.permissionCode === permissionCode)

			return {
				PERMISSION: permissionCode,
				ALLOWED: permission ? 'YES' : 'NO',
				MODULE: permission?.moduleCode ?? '-',
				ACTION: permission?.action.code ?? '-',
				LEVEL: permission?.action.level ?? '-',
			}
		})

		console.groupCollapsed('%c[AUTH] Permission Matrix', 'color:#8b5cf6;font-weight:bold')

		console.table(table)

		console.groupEnd()
	}
}
