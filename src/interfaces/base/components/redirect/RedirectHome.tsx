import { Navigate } from 'react-router-dom'

import { useAuth } from '../../../Login/hooks/useAuth.h'

interface RedirectHomeProps {
	authenticatedPath: string
	unauthenticatedPath: string
}

const RedirectHome = ({ authenticatedPath, unauthenticatedPath }: RedirectHomeProps) => {
	const { user, authInitialized } = useAuth()

	if (!authInitialized) {
		return null
	}

	return user ? <Navigate to={authenticatedPath} replace /> : <Navigate to={unauthenticatedPath} replace />
}

export default RedirectHome
