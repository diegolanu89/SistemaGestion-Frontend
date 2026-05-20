import { createContext, useContext } from 'react'
import { IDashboardHoursContext } from '../model/IDashBoardContext.m'

export const dashboardHoursContext = createContext<IDashboardHoursContext | null>(null)

export const useDashboardHoursContext = (): IDashboardHoursContext => {
	const context = useContext(dashboardHoursContext)
	if (!context) {
		throw new Error('useDashboardHoursContext debe ser utilizado dentro de un dashboardHoursProvider')
	}
	return context
}
