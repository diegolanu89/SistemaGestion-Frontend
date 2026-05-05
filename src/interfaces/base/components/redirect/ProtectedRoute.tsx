import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../../Login/hooks/useAuth.h'

interface ProtectedRouteProps {
	redirectTo: string
}

const ProtectedRoute = ({ redirectTo }: ProtectedRouteProps): JSX.Element | null => {
	const { user, loading } = useAuth()

	if (loading) return null

	if (!user) return <Navigate to={redirectTo} replace />

	return <Outlet />
}

export default ProtectedRoute
