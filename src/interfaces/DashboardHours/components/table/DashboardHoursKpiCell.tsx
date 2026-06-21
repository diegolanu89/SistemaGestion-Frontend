import { FC } from 'react'
import { DashboardHoursMonthDto } from '../../model/DashboardHoursDTO.m'
import { getCapacityStatus } from '../../utils/dashboardHoursUtil'

interface Props {
	month?: DashboardHoursMonthDto

	expected: number
}

export const DashboardHoursKpiCell: FC<Props> = ({ month, expected }) => {
	const hours = month?.hours ?? 0

	const percentage = expected > 0 ? (hours / expected) * 100 : 0

	const status = getCapacityStatus(hours, expected)

	return (
		<td className="dashboard-hours-table__cell">
			<div className="dashboard-hours-table__kpi-cell">
				<strong>{percentage.toFixed(0)}%</strong>

				<div className="dashboard-hours-table__kpi-bar">
					<div
						className={`dashboard-hours-table__kpi-fill ${status === 'danger' ? 'is-danger' : status === 'success' ? 'is-success' : 'is-empty'}`}
						style={{
							width: `${Math.min(percentage, 100)}%`,
						}}
					/>
				</div>

				<small>{hours.toFixed(1)}h</small>
			</div>
		</td>
	)
}
