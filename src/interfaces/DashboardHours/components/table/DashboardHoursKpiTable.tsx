import { FC } from 'react'

import { DashboardHoursKpiCell } from './DashboardHoursKpiCell'
import { DashboardHoursRowDto } from '../../model/DashboardHoursDTO.m'

import { getRoleClass } from '../../utils/dashboardHoursUtil'

interface Props {
	rows: DashboardHoursRowDto[]

	months: string[]

	monthHours: Record<string, number>

	timeEntriesEnabled: boolean

	clockifyLoading: boolean

	clockifyData: Record<number, unknown>
}

const getTimeEntriesHoursByMonth = (row: DashboardHoursRowDto, clockifyData: Record<number, unknown>): Record<string, number> => {
	const result: Record<string, number> = {}

	for (const detail of row.details) {
		if (detail.project_type !== 'R' || !detail.project_id) {
			continue
		}

		const projectData = clockifyData[detail.project_id] as
			| {
					data?: Array<{
						user_id: number
						user_name: string
						total_hours: number
						months: Record<string, number>
					}>
			  }
			| undefined

		if (!projectData?.data?.length) {
			continue
		}

		const userData = projectData.data.find((user) => user.user_name?.trim().toLowerCase() === row.user_name?.trim().toLowerCase())

		if (!userData) {
			continue
		}

		Object.entries(userData.months).forEach(([monthKey, hours]) => {
			result[monthKey] = (result[monthKey] ?? 0) + hours
		})
	}

	return result
}

export const DashboardHoursKpiTable: FC<Props> = ({
	rows,

	months,

	monthHours,

	timeEntriesEnabled,

	clockifyLoading,

	clockifyData,
}) => {
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
					{rows.map((row) => {
						const timeEntriesHoursByMonth = timeEntriesEnabled ? getTimeEntriesHoursByMonth(row, clockifyData) : {}

						return (
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
									if (timeEntriesEnabled && clockifyLoading) {
										return (
											<td key={`${row.user_id}-${monthKey}`} className="dashboard-hours-table__cell">
												<div className="dashboard-hours-table__skeleton" />
											</td>
										)
									}

									const expected = row.months?.[monthKey]?.expected ?? monthHours?.[monthKey] ?? 160

									const month = timeEntriesEnabled
										? {
												hours: timeEntriesHoursByMonth[monthKey] ?? 0,
												expected,
											}
										: row.months?.[monthKey]

									return <DashboardHoursKpiCell key={`${row.user_id}-${monthKey}`} month={month} expected={expected} />
								})}
							</tr>
						)
					})}
				</tbody>
			</table>
		</div>
	)
}
