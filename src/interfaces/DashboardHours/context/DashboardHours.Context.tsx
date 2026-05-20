import { useMemo, useState, ReactNode } from 'react'
import { IDashboardHoursContext } from '../model/IDashBoardContext.m'
import { dashboardHoursContext } from '../hooks/useEstimatedProjectContext.h'

interface Props {
	children: ReactNode
}

export const DashboardHoursProvider = ({ children }: Props) => {
	const [loading, setLoading] = useState<boolean>(false)

	const value: IDashboardHoursContext = useMemo(
		() => ({
			loading,
			setLoading,
		}),
		[loading]
	)
	return <dashboardHoursContext.Provider value={value}>{children}</dashboardHoursContext.Provider>
}
