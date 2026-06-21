// views/DashboardHours.v.tsx

import { FC, useEffect } from 'react'

import { SectionLoader } from '../../base/components/loading/SectionLoader'

import DashboardHourHeader from '../components/DashboardHourHeader'
import DashboardHoursFilters from '../components/DashboardHoursFilters'
import DashboardHoursToolbar from '../components/DashboardHoursToolbar'

import { useDashboardHoursContext } from '../hooks/useEstimatedProjectContext.h'
import { DashboardHoursTable } from '../components/DashboardHoursTable'

export const DashboardHours: FC = () => {
	const { loading, loadDashboard, loadSavedFilters } = useDashboardHoursContext()

	useEffect(() => {
		void loadDashboard()

		void loadSavedFilters()
	}, [loadDashboard, loadSavedFilters])

	return (
		<div className="dashboard-hours-container">
			<DashboardHourHeader />

			<DashboardHoursFilters />

			<DashboardHoursToolbar />

			<DashboardHoursTable />

			{loading && <SectionLoader text="Procesando dashboard de horas..." />}
		</div>
	)
}

export default DashboardHours
