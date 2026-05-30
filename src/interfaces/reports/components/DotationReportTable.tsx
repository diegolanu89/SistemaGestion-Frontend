import { FC } from 'react'

import { DotationPreviewDto } from '../models/DotacionPreviewDTO.m'

import { getRoleClass } from '../utils/getRoleClass'

interface Props {
	preview: DotationPreviewDto
}

const DotationReportTable: FC<Props> = ({ preview }) => {
	if (!preview.rows.length) {
		return null
	}

	const months = Object.keys(preview.rows[0].months)

	return (
		<div className="dotation-report__preview">
			<div className="dotation-report__preview-header">
				<h2>Dotación Consolidada</h2>

				<span>{preview.rows.length} recursos</span>
			</div>

			<div className="dotation-report__table-wrapper">
				<table className="dotation-report__table">
					<thead>
						<tr>
							<th>Usuario</th>

							<th>Líder</th>

							<th>Rol</th>

							<th>Estado</th>

							<th>Bench</th>

							<th>Horas</th>

							<th>Capacidad</th>

							<th>% Util.</th>

							<th>Desvío</th>

							<th>Forecast ETC</th>

							<th>Cap. Futura</th>

							<th>Dif. Futura</th>

							<th>Clientes</th>

							<th>Proyectos</th>

							{months.map((month) => (
								<th key={month}>{month}</th>
							))}
						</tr>
					</thead>

					<tbody>
						{preview.rows.map((row) => (
							<tr key={`${row.userId}-${row.userName}`}>
								<td>
									<div className="dotation-report__user">
										<strong>{row.userName}</strong>
									</div>
								</td>

								<td>
									<div className="dotation-report__leader">{row.leader}</div>
								</td>

								<td>
									<span className={`dotation-report__role-badge ${getRoleClass(row.role)}`}>{row.role}</span>
								</td>

								<td>
									<span className={`dotation-report__status dotation-report__status--${row.status}`}>{row.status}</span>
								</td>

								<td>
									<span className={row.isBench ? 'dotation-report__capacity-warning' : 'dotation-report__capacity-ok'}>{row.isBench ? 'Sí' : 'No'}</span>
								</td>

								<td>
									<strong>{row.totalHours.toFixed(1)}</strong>
								</td>

								<td>{row.capacity.toFixed(1)}</td>

								<td
									className={
										row.utilization > 100
											? 'dotation-report__capacity-danger'
											: row.utilization > 80
												? 'dotation-report__capacity-warning'
												: 'dotation-report__capacity-ok'
									}
								>
									{row.utilization.toFixed(1)}%
								</td>

								<td className={row.deviation < 0 ? 'dotation-report__capacity-danger' : 'dotation-report__capacity-ok'}>{row.deviation.toFixed(1)}</td>

								<td>{row.forecastEtc.toFixed(1)}</td>

								<td>{row.futureCapacity.toFixed(1)}</td>

								<td className={row.futureDifference >= 0 ? 'dotation-report__capacity-ok' : 'dotation-report__capacity-danger'}>
									{row.futureDifference.toFixed(1)}
								</td>

								<td>
									<div className="dotation-report__chips">
										{row.clients.length > 0 ? (
											row.clients.map((client) => (
												<span key={client} className="dotation-report__chip">
													{client}
												</span>
											))
										) : (
											<span>-</span>
										)}
									</div>
								</td>

								<td>
									<div className="dotation-report__chips">
										{row.projects.length > 0 ? (
											row.projects.map((project) => (
												<span key={project} className="dotation-report__chip">
													{project}
												</span>
											))
										) : (
											<span>-</span>
										)}
									</div>
								</td>

								{months.map((month) => {
									const hours = row.months[month]?.hours ?? 0

									const className =
										hours >= 160
											? 'dotation-report__capacity-danger'
											: hours >= 120
												? 'dotation-report__capacity-warning'
												: hours > 0
													? 'dotation-report__capacity-ok'
													: ''

									return (
										<td key={`${row.userId}-${month}`} className={className}>
											{hours > 0 ? hours.toFixed(1) : '-'}
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

export default DotationReportTable
