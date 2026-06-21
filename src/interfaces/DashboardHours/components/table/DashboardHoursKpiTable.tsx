import { FC } from 'react'

import { DashboardHoursKpiCell } from './DashboardHoursKpiCell'
import { DashboardHoursRowDto } from '../../model/DashboardHoursDTO.m'
import { getRoleClass } from '../../utils/dashboardHoursUtil'

interface Props {
	rows: DashboardHoursRowDto[]

	months: string[]

	monthHours: Record<string, number>
}

export const DashboardHoursKpiTable: FC<Props> = ({ rows, months, monthHours }) => {
	return (
		<div className="dashboard-hours-table__wrapper">
			<table className="dashboard-hours-table">
				<thead>
					<tr>
						<th>Usuario</th>

						<th>Rol</th>

						{months.map((monthKey) => (
							<th key={monthKey}>
								<div className="dashboard-hours-table__month-header">
									<span>{monthKey}</span>

									<small>{monthHours?.[monthKey] ?? 160}h</small>
								</div>
							</th>
						))}
					</tr>
				</thead>

				<tbody>
					{rows.map((row) => (
						<tr key={row.user_id} className="dashboard-hours-table__row">
							<td className="dashboard-hours-table__cell">
								<div className="dashboard-hours-table__user-main">
									<strong className="dashboard-hours-table__user-name">{row.user_name}</strong>
								</div>
							</td>

							<td className="dashboard-hours-table__cell">
								<span className={`dashboard-hours-table__role ${getRoleClass(row.role_short)}`}>{row.role_short ?? 'N/A'}</span>
							</td>

							{months.map((monthKey) => {
								const month = row.months?.[monthKey]

								const expected = month?.expected ?? monthHours?.[monthKey] ?? 160

								return <DashboardHoursKpiCell key={`${row.user_id}-${monthKey}`} month={month} expected={expected} />
							})}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
