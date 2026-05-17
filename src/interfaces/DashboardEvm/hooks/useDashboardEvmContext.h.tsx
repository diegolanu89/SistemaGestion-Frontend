import { createContext, useContext } from 'react'
import { IDashboardEvmContext } from '../models/IDashboardEvmContext.m'

export const dashboardEvmContext = createContext<IDashboardEvmContext | null>(null)

export const useDashboardEvmContext = (): IDashboardEvmContext => {
	const context = useContext(dashboardEvmContext)

	if (!context) {
		throw new Error('useDashboardEvmContext debe ser utilizado dentro de un DashboardEvmProvider')
	}

	return context
}
