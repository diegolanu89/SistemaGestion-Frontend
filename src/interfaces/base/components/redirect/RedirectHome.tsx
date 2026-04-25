// src/components/navigation/RedirectHome.tsx

import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../../Login/hooks/useAuth.h'

interface RedirectHomeProps {
	authenticatedPath: string
	unauthenticatedPath: string
}

const RedirectHome = ({ authenticatedPath, unauthenticatedPath }: RedirectHomeProps) => {
	const { user } = useAuth()
	const [checkingAuth, setCheckingAuth] = useState(true)

	useEffect(() => {
		const timer = setTimeout(() => {
			setCheckingAuth(false)
		}, 100)

		return () => clearTimeout(timer)
	}, [])

	if (checkingAuth) return null

	return user ? <Navigate to={authenticatedPath} replace /> : <Navigate to={unauthenticatedPath} replace />
}

export default RedirectHome
