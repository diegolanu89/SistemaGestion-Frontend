import { FC } from 'react'

import { DashboardHoursResponseDto } from '../../DashboardHours/model/DashboardHoursDTO.m'

interface Props {
	reportData: DashboardHoursResponseDto
}

const getRoleClass = (role?: string | null): string => {
	switch ((role ?? '').toLowerCase()) {
		case 'dev':
		case 'developer':
		case 'des':
			return 'is-dev'

		case 'qa':
			return 'is-qa'

		case 'pm':
			return 'is-pm'

		case 'ld':
		case 'lead':
		case 'líder':
		case 'lider':
			return 'is-lead'

		case 'af':
		case 'ba':
		case 'analista':
			return 'is-ba'

		default:
			return 'is-default'
	}
}

const DotationReportTable: FC<Props> = ({ reportData }) => {
	return (
		<div className="dotation-report__preview">
			<div className="dotation-report__preview-header">
				<h2>Dotación Detallada</h2>

				<span>{reportData.data.length} registros</span>
			</div>

			<div className="dotation-report__table-wrapper">
				<table className="dotation-report__table">
					<thead>
						<tr>
							<th>Usuario</th>

							<th>Líder</th>

							<th>Rol</th>

							<th>Asignaciones</th>

							<th>Total Horas</th>

							{reportData.months.map((month) => (
								<th key={month}>{month}</th>
							))}
						</tr>
					</thead>

					<tbody>
						{reportData.data.map((row) => {
							const totalHours = Object.values(row.months).reduce((acc, month) => acc + month.hours, 0)

							const groupedAssignments = (row.details ?? []).reduce(
								(acc, detail) => {
									const client = detail.client_name ?? 'Sin cliente'

									if (!acc[client]) {
										acc[client] = []
									}

									if (detail.project_name && !acc[client].includes(detail.project_name)) {
										acc[client].push(detail.project_name)
									}

									return acc
								},
								{} as Record<string, string[]>
							)

							return (
								<tr key={`${row.user_id}-${row.user_name}`}>
									<td>
										<div className="dotation-report__user">
											<strong>{row.user_name}</strong>
										</div>
									</td>

									<td>
										<div className="dotation-report__leader">{row.leader_name ?? '-'}</div>
									</td>

									<td>
										<span className={`dotation-report__role-badge ${getRoleClass(row.role_short)}`}>{row.role_short ?? '-'}</span>
									</td>

									<td>
										<div className="dotation-report__assignments">
											{Object.entries(groupedAssignments).length > 0 ? (
												Object.entries(groupedAssignments).map(([client, projects]) => (
													<div key={client} className="dotation-report__assignment-group">
														<div className="dotation-report__assignment-client">{client}</div>

														<div className="dotation-report__assignment-projects">
															{projects.map((project) => (
																<span key={`${client}-${project}`} className="dotation-report__assignment-project">
																	{project}
																</span>
															))}
														</div>
													</div>
												))
											) : (
												<span>-</span>
											)}
										</div>
									</td>

									<td>
										<strong>{totalHours.toFixed(1)}</strong>
									</td>

									{reportData.months.map((month) => {
										const hours = row.months?.[month]?.hours ?? 0

										let className = ''

										if (hours >= 160) {
											className = 'dotation-report__capacity-danger'
										} else if (hours >= 120) {
											className = 'dotation-report__capacity-warning'
										} else if (hours > 0) {
											className = 'dotation-report__capacity-ok'
										}

										return (
											<td key={`${row.user_id}-${month}`} className={className}>
												{hours > 0 ? hours.toFixed(1) : '-'}
											</td>
										)
									})}
								</tr>
							)
						})}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default DotationReportTable
