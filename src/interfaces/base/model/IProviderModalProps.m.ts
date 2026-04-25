import { ReactNode } from 'react'

/**
 * 🧩 IProviderProps
 *
 * Define los props que reciben los componentes `Provider`,
 * específicamente los elementos hijos (`children`) que estarán envueltos por el proveedor.
 *
 * Este componente es responsable de proveer el contexto de autenticación
 * a toda la aplicación, permitiendo que los componentes hijos accedan
 * al estado de sesión y funciones como login, logout y registro.
 *
 * @property children - Elementos React que serán envueltos por el proveedor de autenticación.
 *
 * @example
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 */
export interface IProviderModalProps {
	children: ReactNode
}
