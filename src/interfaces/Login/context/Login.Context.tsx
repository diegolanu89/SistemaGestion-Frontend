import { useState, useMemo, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAdapter } from '../services/LoginAdapterFactory.s'
import { authContext } from '../hooks/useAuth.h'
import type { IUser } from '../models/IUser.m'
import type { IProviderProps } from '../models/IProviderProps.m'
import { AuthLoading } from '../../base/components/loading/AuthLoading'
import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'
import { PermissionUtils } from '../utils/PermissionUtils'

export const AuthProvider = ({ children, home }: IProviderProps) => {
	const [user, setUser] = useState<IUser | null>(null)

	const [loading, setLoading] = useState(false)

	const [authInitialized, setAuthInitialized] = useState(false)

	const navigate = useNavigate()

	// ==========================
	// 🔹 CENTRALIZED SECURITY LOG
	// ==========================

	const logPermissions = useCallback((user: IUser, source: string) => {
		logger.infoTag(LogTag.Security, `[AUTH] ${source}`, {
			userId: user.id,
			email: user.email,
			profile: user.profileCode,
		})

		if (!user.profilePermissions?.permissions?.length) {
			logger.warnTag(LogTag.Security, '[AUTH] no permissions assigned')

			return
		}

		PermissionUtils.printPermissionsTable(user)

		PermissionUtils.getExpectedPermissions().forEach((permissionCode) => {
			const allowed = PermissionUtils.hasPermission(user, permissionCode)

			if (allowed) {
				logger.infoTag(LogTag.Security, `[PERMISSION] ${permissionCode} -> allowed`)
			} else {
				logger.warnTag(LogTag.Security, `[PERMISSION] ${permissionCode} -> denied`)
			}
		})
	}, [])

	// ==========================
	// 🔹 RESTORE SESSION
	// ==========================

	useEffect(() => {
		const restore = async () => {
			try {
				const restoredUser = await authAdapter.getUser()

				logPermissions(restoredUser, 'session restored')

				setUser(restoredUser)
			} catch {
				setUser(null)
			} finally {
				setAuthInitialized(true)
			}
		}

		restore()
	}, [logPermissions])

	// ==========================
	// 🔹 LOGIN
	// ==========================

	const login = useCallback(
		async (email: string, password: string) => {
			setLoading(true)

			try {
				const loggedUser = await authAdapter.login(email, password)

				logPermissions(loggedUser, 'permissions loaded')

				setUser(loggedUser)

				setTimeout(() => {
					navigate(home)
				}, 700)
			} finally {
				setLoading(false)
			}
		},
		[navigate, home, logPermissions]
	)

	// ==========================
	// 🔹 LOGOUT
	// ==========================

	const logout = useCallback(async () => {
		setLoading(true)

		try {
			await authAdapter.logout()

			logger.infoTag(LogTag.Security, '[AUTH] logout')
		} finally {
			setUser(null)

			setLoading(false)

			navigate('/')
		}
	}, [navigate])

	const value = useMemo(
		() => ({
			user,
			login,
			logout,
			setUser,
			loading,
			authInitialized,
		}),
		[user, login, logout, loading, authInitialized]
	)

	if (!authInitialized) {
		return <AuthLoading />
	}

	return (
		<authContext.Provider value={value}>
			{children}

			{loading && <AuthLoading />}
		</authContext.Provider>
	)
}
