import { createContext, useContext } from 'react'
import { IAuthContext } from '../models/IAuthContext.m'

/**
 * 🧠 authContext
 *
 * Contexto global de autenticación.
 * Proporciona acceso al estado de autenticación y operaciones relacionadas
 * como login, logout y registro de usuarios.
 *
 * Este contexto debe ser envuelto por un `AuthProvider` que implemente
 * el contrato definido por `IAuthContext`.
 *
 * @type {React.Context<IAuthContext | null>}
 * @example
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 */
export const authContext = createContext<IAuthContext | null>(null)

/**
 * 🪝 useAuth
 *
 * Hook personalizado para acceder al contexto de autenticación.
 * Lanza un error si se usa fuera de un `AuthProvider`.
 *
 * @returns {IAuthContext} El contexto de autenticación actual.
 *
 * @throws {Error} Si el hook se usa fuera de un `AuthProvider`.
 *
 * @example
 * const { user, login, logout } = useAuth();
 * if (user) {
 *   console.log(`Usuario autenticado: ${user.name}`);
 * }
 */
export const useAuth = (): IAuthContext => {
	const context = useContext(authContext)
	if (!context) {
		throw new Error('useAuth debe ser utilizado dentro de un AuthProvider')
	}
	return context
}
