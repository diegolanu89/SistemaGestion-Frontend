// hooks/useReports.h.ts

import { createContext, useContext } from 'react'
import { IReportsContext } from '../models/IReportContext.m'

export const reportsContext = createContext<IReportsContext | null>(null)

export const useReports = (): IReportsContext => {
	const context = useContext(reportsContext)

	if (!context) {
		throw new Error('useReports must be used within ReportsProvider')
	}

	return context
}
