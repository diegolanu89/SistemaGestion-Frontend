import { FC, Fragment, useMemo } from 'react'

import { DashboardHoursRowDto } from '../../model/DashboardHoursDTO.m'

import { DashboardHoursMonthCell } from './DashboardHoursMonthCell'
import { DashboardHoursDetailRow } from './DashboardHoursDetailRow'

import { getRoleClass, getProjectChipClass } from '../../utils/dashboardHoursUtil'

interface Props {
	row: DashboardHoursRowDto

	months: string[]

	monthHours: Record<string, number | null>

	expanded: boolean

	onToggleUser: (userId: number) => void

	timeEntriesEnabled: boolean

	clockifyLoading: boolean

	clockifyData: Record<number, unknown>
}

export const DashboardHoursMainRow: FC<Props> = ({
	row,

	months,

	monthHours,

	expanded,

	onToggleUser,

	timeEntriesEnabled,

	clockifyLoading,

	clockifyData,
}) => {
	const hasDetails = row.details.length > 0

	const timeEntriesHoursByMonth = useMemo(() => {
		if (!timeEntriesEnabled) {
			return {}
		}

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
	}, [row.details, row.user_name, timeEntriesEnabled, clockifyData])

	const total = useMemo(() => {
		if (timeEntriesEnabled) {
			return Object.values(timeEntriesHoursByMonth).reduce((acc, value) => acc + value, 0)
		}

		return Object.values(row.months).reduce((acc, current) => acc + current.hours, 0)
	}, [row.months, timeEntriesEnabled, timeEntriesHoursByMonth])

	const displayClient = useMemo(() => {
		if (!row.details.length) {
			return row.client_name ?? '-'
		}

		const clients = [...new Set(row.details.map((x) => x.client_name).filter(Boolean))]

		if (clients.length === 1) {
			return clients[0]
		}

		return `Varios (${clients.length})`
	}, [row])

	const displayProject = useMemo(() => {
		if (!row.details.length) {
			return row.project_name ?? '-'
		}

		if (row.details.length === 1) {
			return row.details[0].project_name
		}

		return `${row.details.length} proyectos`
	}, [row])

	return (
		<Fragment>
			<tr className="dashboard-hours-table__row">
				<td className="dashboard-hours-table__cell dashboard-hours-table__user-cell">
					<button className="dashboard-hours-table__expand" onClick={() => onToggleUser(row.user_id)} disabled={!hasDetails}>
						{expanded ? '−' : '+'}
					</button>

					<div className="dashboard-hours-table__user-info">
						<div className="dashboard-hours-table__user-main">
							<span className={`dashboard-hours-table__role ${getRoleClass(row.role_short)}`}>{row.role_short ?? 'N/A'}</span>

							<strong className="dashboard-hours-table__user-name">{row.user_name}</strong>
						</div>

						{row.leader_name && <span className="dashboard-hours-table__leader">Líder asignado: {row.leader_name}</span>}
					</div>
				</td>

				<td className="dashboard-hours-table__cell">
					<span className="dashboard-hours-table__secondary-text">{displayClient}</span>
				</td>

				<td className="dashboard-hours-table__cell">
					<div className="dashboard-hours-table__project">
						<span className="dashboard-hours-table__project-name">{displayProject}</span>

						{!row.details.length && row.project_type && (
							<span className={`dashboard-hours-table__project-chip ${getProjectChipClass(row.project_type)}`}>{row.project_type}</span>
						)}
					</div>
				</td>

				{months.map((monthKey) => {
					if (timeEntriesEnabled && clockifyLoading) {
						return (
							<td key={`${row.user_id}-${monthKey}`} className="dashboard-hours-table__cell">
								<div className="dashboard-hours-table__skeleton" />
							</td>
						)
					}

					return (
						<DashboardHoursMonthCell
							key={`${row.user_id}-${monthKey}`}
							month={
								timeEntriesEnabled
									? {
											hours: timeEntriesHoursByMonth[monthKey] ?? 0,
											expected: row.months?.[monthKey]?.expected ?? 0,
										}
									: row.months?.[monthKey]
							}
							expected={row.months?.[monthKey]?.expected ?? monthHours?.[monthKey] ?? 160}
						/>
					)
				})}

				<td className="dashboard-hours-table__cell dashboard-hours-table__total-cell">
					<strong>{total.toFixed(1)}h</strong>
				</td>
			</tr>

			{expanded &&
				row.details.map((detail) => (
					<DashboardHoursDetailRow key={`${row.user_id}-${detail.project_id}`} userId={row.user_id} detail={detail} months={months} monthHours={monthHours} />
				))}
		</Fragment>
	)
}
