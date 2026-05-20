// views/DashboardHours.v.tsx

import { FC } from 'react'

import { SectionLoader } from '../../base/components/loading/SectionLoader'

import DashboardHourHeader from '../components/DashboardHourHeader'
import { useDashboardHoursContext } from '../hooks/useEstimatedProjectContext.h'

export const DashboardHours: FC = () => {
	const { loading } = useDashboardHoursContext()

	return (
		<div className="dashboard-hours-container">
			<DashboardHourHeader />

			{loading && <SectionLoader text="Procesando dashboard de horas..." />}
		</div>
	)
}

export default DashboardHours
