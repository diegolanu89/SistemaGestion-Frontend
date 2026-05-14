// utils/PermissionLogger.util.ts

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'
import { IUser } from '../../Login/models/IUser.m'

interface PermissionCheck {
	label: string
	permission: string
	allowed: boolean
}

export class PermissionLogger {
	static printUserPermissions(user: IUser, source: string): void {
		logger.infoTag(LogTag.Security, `🔐 [AUTH] ${source}`, {
			userId: user.id,
			email: user.email,
			profile: user.profileCode,
		})

		if (!user.profilePermissions?.permissions?.length) {
			logger.warnTag(LogTag.Security, '⚠️ [AUTH] user without permissions')
			return
		}

		console.table(
			user.profilePermissions.permissions.map((permission) => ({
				PERMISSION: permission.permissionCode,
				MODULE: permission.moduleCode,
				ACTION: permission.action.code,
				LEVEL: permission.action.level,
			}))
		)
	}

	static printPermissionChecks(checks: PermissionCheck[]): void {
		checks.forEach((check) => {
			if (check.allowed) {
				logger.infoTag(LogTag.Security, `✅ [ACCESS] ${check.label} -> allowed`)
			} else {
				logger.warnTag(LogTag.Security, `⛔ [ACCESS] ${check.label} -> denied`)
			}
		})

		console.table(
			checks.map((check) => ({
				FLOW: check.label,
				PERMISSION: check.permission,
				STATUS: check.allowed ? 'ALLOWED' : 'DENIED',
			}))
		)
	}
}
