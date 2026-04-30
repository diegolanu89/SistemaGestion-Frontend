import { createContext, useContext } from 'react'
import { IProyectViewContext } from '../models/IProyectViewContext.m'

export const proyectViewContext = createContext<IProyectViewContext | null>(null)

export const useProyectViewContext = (): IProyectViewContext => {
	const context = useContext(proyectViewContext)
	if (!context) {
		throw new Error('useProyectViewContext debe ser utilizado dentro de un AuthProvider')
	}
	return context
}
