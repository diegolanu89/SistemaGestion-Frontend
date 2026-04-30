import { createContext, useContext } from 'react'
import { IEstimatedProjectContext } from '../models/IEstimatedProjectContext.m'

export const estimatedProjectContext = createContext<IEstimatedProjectContext | null>(null)

export const useEstimatedProjectContext = (): IEstimatedProjectContext => {
	const context = useContext(estimatedProjectContext)
	if (!context) {
		throw new Error('useEstimatedProjectContext debe ser utilizado dentro de un EstimatedProjectProvider')
	}
	return context
}
