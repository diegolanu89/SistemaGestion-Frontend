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

export const ProjectHoursKpiTable: FC<Props> = ({ rows, months, monthHours, clockifyHoursData }) => {
	return (
		<div className="project-hours-kpi">
			<div className="project-hours-kpi__wrapper">
				<table className="project-hours-kpi__table">
					<thead>
						<tr>
							<th>Usuario</th>

							<th>Rol</th>

							{months.map((monthKey) => (
								<th key={monthKey}>
									<div className="project-hours-kpi__month-header">
										<span>{monthKey}</span>

										<small>Capacidad: {monthHours?.[monthKey] ?? 160}h</small>
									</div>
								</th>
							))}
						</tr>
					</thead>

					<tbody>
						{rows.map((row) => (
							<tr key={row.user_id} className="project-hours-kpi__row">
								<td className="project-hours-kpi__cell">
									<strong className="project-hours-kpi__user-name">{row.user_name}</strong>
								</td>

								<td className="project-hours-kpi__cell">
									<span className={`project-hours-kpi__role ${getRoleClass(row.role_short)}`}>{row.role_short ?? 'N/A'}</span>
								</td>

								{months.map((monthKey) => {
									const assigned = row.months?.[monthKey]?.hours ?? 0

									const consumed = getConsumedHours(clockifyHoursData, row.user_name, monthKey)

									const available = assigned - consumed

									const percentage = assigned > 0 ? (consumed / assigned) * 100 : 0

									const statusClass = percentage > 100 ? 'is-danger' : percentage > 80 ? 'is-warning' : 'is-success'

									return (
										<td key={`${row.user_id}-${monthKey}`} className="project-hours-kpi__cell">
											<div className="project-hours-kpi__card">
												<div className="project-hours-kpi__percentage">
													<strong>{percentage.toFixed(0)}%</strong>
												</div>

												<div className="project-hours-kpi__bar">
													<div
														className={`project-hours-kpi__fill ${statusClass}`}
														style={{
															width: `${Math.min(percentage, 100)}%`,
														}}
													/>
												</div>

												<div className="project-hours-kpi__metrics">
													<div>
														<span>Consumidas</span>

														<strong>{consumed.toFixed(1)}h</strong>
													</div>

													<div>
														<span>Asignadas</span>

														<strong>{assigned.toFixed(1)}h</strong>
													</div>

													<div>
														<span>Saldo</span>

														<strong className={available < 0 ? 'is-danger' : 'is-success'}>{available.toFixed(1)}h</strong>
													</div>
												</div>
											</div>
										</td>
									)
								})}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}
