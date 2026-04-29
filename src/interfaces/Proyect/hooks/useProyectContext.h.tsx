import { createContext, useContext } from 'react'
import { IProyectContext } from '../models/IProyectContext.m'

export const proyectContext = createContext<IProyectContext | null>(null)

export const useProyectContext = (): IProyectContext => {
	const context = useContext(proyectContext)
	if (!context) {
		throw new Error('useProyectContext debe ser utilizado dentro de un AuthProvider')
	}
	return context
}
