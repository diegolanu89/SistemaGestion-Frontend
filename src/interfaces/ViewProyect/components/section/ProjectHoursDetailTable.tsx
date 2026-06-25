import { FC } from 'react'

import { ClockifyProjectHoursSummaryDto } from '../../models/IClockifySync.m'
import { ProjectUserHoursDto } from '../../models/ProyectViewInterface.m'

import { getRoleClass, getConsumedHours } from '../../utils/projectHourUtils'

interface Props {
	rows: ProjectUserHoursDto[]

	months: string[]

	monthHours: Record<string, number>

	clockifyHoursData: ClockifyProjectHoursSummaryDto | null
}

export const ProjectHoursDetailTable: FC<Props> = ({ rows, months, clockifyHoursData }) => {
	const renderMonthCell = (assigned: number, consumed: number, key: string) => {
		const available = Math.max(assigned - consumed, 0)

		const isExceeded = consumed > assigned

		const isCompleted = assigned > 0 && consumed === assigned

		const statusClass = isExceeded ? 'is-danger' : isCompleted ? 'is-success' : 'is-neutral'

		return (
			<td key={key} className="project-hours-detail__month-cell">
				<div className={`project-hours-detail__card ${statusClass}`}>
					{available > 0 && (
						<div className="project-hours-detail__warning" title={`Quedan ${available.toFixed(1)} horas disponibles`}>
							<span className="material-icons">warning_amber</span>
						</div>
					)}

					<div className="project-hours-detail__comparison">
						<div className="project-hours-detail__metric">
							<span className="project-hours-detail__label">Asignadas</span>

							<strong>{assigned.toFixed(1)}h</strong>
						</div>

						<div className="project-hours-detail__divider">
							<span className="material-icons">compare_arrows</span>
						</div>

						<div className="project-hours-detail__metric">
							<span className="project-hours-detail__label">Consumidas</span>

							<strong>{consumed.toFixed(1)}h</strong>
						</div>
					</div>
				</div>
			</td>
		)
	}

	return (
		<div className="project-hours-detail">
			<div className="project-hours-detail__wrapper">
				<table className="project-hours-detail__table">
					<thead>
						<tr>
							<th>Usuario</th>

							{months.map((monthKey) => (
								<th key={monthKey}>
									<div className="project-hours-detail__month-header">
										<span>{monthKey}</span>
									</div>
								</th>
							))}

							<th>Total ETC</th>
						</tr>
					</thead>

					<tbody>
						{rows.map((row) => (
							<tr key={row.user_id} className="project-hours-detail__row">
								<td className="project-hours-detail__user-cell">
									<div className="project-hours-detail__user-info">
										<div className="project-hours-detail__user-main">
											<span className={`project-hours-detail__role ${getRoleClass(row.role_short)}`}>{row.role_short ?? 'N/A'}</span>

											<strong>{row.user_name}</strong>
										</div>

										{row.leader_name && <span className="project-hours-detail__leader">Líder asignado: {row.leader_name}</span>}
									</div>
								</td>

								{months.map((monthKey) => {
									const assigned = row.months?.[monthKey]?.hours ?? 0

									const consumed = getConsumedHours(clockifyHoursData, row.user_name, monthKey)

									return renderMonthCell(assigned, consumed, `${row.user_id}-${monthKey}`)
								})}

								<td className="project-hours-detail__total-cell">
									<strong>{row.total_hours.toFixed(1)}h</strong>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}
