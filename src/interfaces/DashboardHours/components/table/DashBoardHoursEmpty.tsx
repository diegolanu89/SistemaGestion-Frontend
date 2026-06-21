import { FC } from 'react'

export const DashboardHoursEmpty: FC = () => {
	return (
		<div className="dashboard-hours-table__empty">
			<span className="material-icons">monitoring</span>

			<p>No hay datos disponibles para el dashboard.</p>
		</div>
	)
}
