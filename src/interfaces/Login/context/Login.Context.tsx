import { useState, useMemo, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { authAdapter } from '../services/LoginAdapterFactory.s'
import { authContext } from '../hooks/useAuth.h'
import type { IUser } from '../models/IUser.m'
import type { IProviderProps } from '../models/IProviderProps.m'
import { AuthLoading } from '../../base/components/loading/AuthLoading'

export const AuthProvider = ({ children, home }: IProviderProps) => {
	const [user, setUser] = useState<IUser | null>(null)
	const [loading, setLoading] = useState(true)

	const navigate = useNavigate()

	// RESTORE SESSION
	useEffect(() => {
		const restore = async () => {
			try {
				const user = await authAdapter.getUser()
				setUser(user)
			} catch {
				setUser(null)
			} finally {
				setLoading(false)
			}
		}

		restore()
	}, [])

	// ==========================
	// LOGIN
	// ==========================
	const login = useCallback(
		async (email: string, password: string) => {
			setLoading(true)

			try {
				const user = await authAdapter.login(email, password)
				setUser(user)

				setTimeout(() => {
					navigate(home)
				}, 700)
			} finally {
				setLoading(false)
			}
		},
		[navigate, home]
	)

	// ==========================
	// LOGOUT
	// ==========================
	const logout = useCallback(async () => {
		setLoading(true)

		try {
			await authAdapter.logout()
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
		}),
		[user, login, logout, loading]
	)

	return (
		<authContext.Provider value={value}>
			{children}
			{loading && <AuthLoading />}
		</authContext.Provider>
	)
}
