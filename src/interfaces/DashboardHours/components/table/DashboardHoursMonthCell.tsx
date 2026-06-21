import { FC } from 'react'

import { DashboardHoursMonthDto } from '../../model/DashboardHoursDTO.m'

import { getCapacityStatus } from '../../utils/dashboardHoursUtil'
import { DashboardHoursIndicatorTooltip } from '../DashboardHoursIndicatorTooltip'

interface Props {
	month?: DashboardHoursMonthDto

	expected: number

	isDetail?: boolean
}

export const DashboardHoursMonthCell: FC<Props> = ({ month, expected, isDetail = false }) => {
	const hours = month?.hours ?? 0

	// =====================================================
	// DETAIL MODE (SIN SEMÁFORO)
	// =====================================================

	if (isDetail) {
		return (
			<td className="dashboard-hours-table__cell dashboard-hours-table__month-cell">
				<div className="dashboard-hours-table__hours dashboard-hours-table__hours--detail">{hours.toFixed(1)}h</div>
			</td>
		)
	}

	// =====================================================
	// SUMMARY MODE (CON SEMÁFORO)
	// =====================================================

	const status = getCapacityStatus(hours, expected)

	const statusClass =
		status === 'danger'
			? 'dashboard-hours-table__hours--danger'
			: status === 'success'
				? 'dashboard-hours-table__hours--success'
				: 'dashboard-hours-table__hours--empty'

	return (
		<td className="dashboard-hours-table__cell dashboard-hours-table__month-cell">
			<div className={`dashboard-hours-table__hours ${statusClass}`}>
				{hours.toFixed(1)}h
				<DashboardHoursIndicatorTooltip hours={hours} expected={expected} status={status} />
			</div>
		</td>
	)
}
