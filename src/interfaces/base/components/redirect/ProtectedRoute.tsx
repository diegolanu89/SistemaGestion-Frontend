// src/components/ProtectedRoute.tsx

import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../../Login/hooks/useAuth.h'

interface ProtectedRouteProps {
	redirectTo: string
}

/**
 * Protege rutas que requieren autenticación.
 *
 * @param redirectTo Ruta a la que se redirige si no hay usuario autenticado
 */
const ProtectedRoute = ({ redirectTo }: ProtectedRouteProps): JSX.Element => {
	const { user } = useAuth()

	return user ? <Outlet /> : <Navigate to={redirectTo} replace />
}

export default ProtectedRoute
