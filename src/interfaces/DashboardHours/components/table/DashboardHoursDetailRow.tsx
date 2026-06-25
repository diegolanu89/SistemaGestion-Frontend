import { FC } from 'react'

import { DashboardHoursDetailDto } from '../../model/DashboardHoursDTO.m'

import { DashboardHoursMonthCell } from './DashboardHoursMonthCell'
import { getProjectChipClass } from '../../utils/dashboardHoursUtil'

interface Props {
	userId: number

	detail: DashboardHoursDetailDto

	months: string[]

	monthHours: Record<string, number | null>
}

export const DashboardHoursDetailRow: FC<Props> = ({ userId, detail, months }) => {
	const total = Object.values(detail.months).reduce((acc, current) => acc + current.hours, 0)

	return (
		<tr className="dashboard-hours-table__detail-row">
			<td className="dashboard-hours-table__cell dashboard-hours-table__user-cell dashboard-hours-table__user-cell--detail">
				<div className="dashboard-hours-table__detail-line" />
			</td>

			<td className="dashboard-hours-table__cell">
				<span className="dashboard-hours-table__secondary-text">{detail.client_name ?? '-'}</span>
			</td>

			<td className="dashboard-hours-table__cell">
				<div className="dashboard-hours-table__project">
					<span className="dashboard-hours-table__project-name">{detail.project_name ?? '-'}</span>

					<span className={`dashboard-hours-table__project-chip ${getProjectChipClass(detail.project_type)}`}>{detail.project_type ?? '-'}</span>
				</div>
			</td>

			{months.map((monthKey) => (
				<DashboardHoursMonthCell key={`${userId}-${detail.project_id}-${monthKey}`} month={detail.months?.[monthKey]} expected={0} isDetail />
			))}

			<td className="dashboard-hours-table__cell dashboard-hours-table__total-cell">
				<strong>{total.toFixed(1)}h</strong>
			</td>
		</tr>
	)
}
