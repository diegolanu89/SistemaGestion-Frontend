// base/components/navigation/ProtectedRoute.tsx

import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '../../../Login/hooks/useAuth.h'

import logger from '../../controllers/Logger.c'

import { LogTag } from '../../model/LogTag.m'
import { PermissionUtils } from '../../../Login/utils/PermissionUtils'

interface ProtectedRouteProps {
	redirectTo: string

	permission?: string
}

const ProtectedRoute = ({ redirectTo, permission }: ProtectedRouteProps): JSX.Element | null => {
	const { user, loading, authInitialized } = useAuth()

	// ==========================
	// 🔹 WAIT AUTH RESTORE
	// ==========================

	if (!authInitialized || loading) {
		return null
	}

	// ==========================
	// 🔹 NO SESSION
	// ==========================

	if (!user) {
		logger.warnTag(LogTag.Security, '[ROUTE] unauthenticated access')

		return <Navigate to={redirectTo} replace />
	}

	// ==========================
	// 🔹 RBAC VALIDATION
	// ==========================

	if (permission) {
		const allowed = PermissionUtils.hasPermission(user, permission)

		if (!allowed) {
			logger.warnTag(LogTag.Security, `[ROUTE] access denied -> ${permission}`)

			return <Navigate to={redirectTo} replace />
		}

		logger.infoTag(LogTag.Security, `[ROUTE] access granted -> ${permission}`)
	}

	// ==========================
	// 🔹 RENDER ROUTE
	// ==========================

	return <Outlet />
}

export default ProtectedRoute
