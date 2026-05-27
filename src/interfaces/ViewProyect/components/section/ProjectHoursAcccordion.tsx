// sections/ProjectHoursAccordion.tsx

import { FC, useEffect, useMemo, useState } from 'react'
import { SectionLoader } from '../../../base/components/loading/SectionLoader'
import { ProjectDto } from '../../models/ProyectViewDTO.m'
import { ProjectHoursResponseDto, ProjectUserHoursDto } from '../../models/ProyectViewInterface.m'
import { proyectViewAdapter } from '../../services/ProyectViewAdapter.s'

interface Props {
	project: ProjectDto
	open: boolean
	onToggle: () => void
}

type ViewMode = 'details' | 'kpis'

type CapacityStatus = 'success' | 'danger' | 'empty'

const PAGE_SIZE = 6

const getCapacityStatus = (hours: number, max: number): CapacityStatus => {
	if (hours <= 0) return 'empty'

	return hours > max ? 'danger' : 'success'
}

const getRoleClass = (role?: string | null): string => {
	const normalized = role?.toUpperCase() ?? 'NA'

	if (normalized.includes('LD')) return 'project-hours-accordion__role--leader'

	if (normalized.includes('DEV')) return 'project-hours-accordion__role--dev'

	if (normalized.includes('QA')) return 'project-hours-accordion__role--qa'

	if (normalized.includes('AF')) return 'project-hours-accordion__role--af'

	return 'project-hours-accordion__role--default'
}

const ProjectHoursAccordion: FC<Props> = ({ project, open, onToggle }) => {
	const [loading, setLoading] = useState(false)

	const [viewMode, setViewMode] = useState<ViewMode>('details')

	const [page, setPage] = useState(1)

	const [hoursData, setHoursData] = useState<ProjectHoursResponseDto | null>(null)

	useEffect(() => {
		if (!open || hoursData) return

		const load = async () => {
			try {
				setLoading(true)

				const start = Date.now()

				const response = await proyectViewAdapter.getProjectHours(project.id)

				const elapsed = Date.now() - start

				const remaining = Math.max(1500 - elapsed, 0)

				await new Promise((resolve) => setTimeout(resolve, remaining))

				setHoursData(response)
			} catch (error: unknown) {
				console.error(error)
			} finally {
				setLoading(false)
			}
		}

		void load()
	}, [open, hoursData, project.id])

	const rows = hoursData?.data ?? []

	const months = hoursData?.months ?? []

	const monthHours = hoursData?.month_hours ?? {}

	const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))

	const paginatedRows = useMemo(() => {
		const start = (page - 1) * PAGE_SIZE

		return rows.slice(start, start + PAGE_SIZE)
	}, [rows, page])

	const renderMonthCell = (hours: number, expected: number, key: string) => {
		const status = getCapacityStatus(hours, expected)

		return (
			<td key={key} className="project-hours-accordion__cell project-hours-accordion__month-cell">
				<div
					className={`project-hours-accordion__hours ${
						status === 'danger'
							? 'project-hours-accordion__hours--danger'
							: status === 'success'
								? 'project-hours-accordion__hours--success'
								: 'project-hours-accordion__hours--empty'
					}`}
				>
					{hours.toFixed(1)}h
				</div>
			</td>
		)
	}

	const renderDetailTable = () => (
		<div className="project-hours-accordion__wrapper">
			<table className="project-hours-accordion__table">
				<thead>
					<tr>
						<th>Usuario</th>

						{months.map((monthKey) => (
							<th key={monthKey}>
								<div className="project-hours-accordion__month-header">
									<span>{monthKey}</span>

									<small>{monthHours?.[monthKey] ?? 160}h</small>
								</div>
							</th>
						))}

						<th>Total</th>
					</tr>
				</thead>

				<tbody>
					{paginatedRows.map((row: ProjectUserHoursDto) => (
						<tr key={row.user_id} className="project-hours-accordion__row">
							<td className="project-hours-accordion__cell project-hours-accordion__user-cell">
								<div className="project-hours-accordion__user-info">
									<div className="project-hours-accordion__user-main">
										<span className={`project-hours-accordion__role ${getRoleClass(row.role_short)}`}>{row.role_short ?? 'N/A'}</span>

										<strong className="project-hours-accordion__user-name">{row.user_name}</strong>
									</div>

									{row.leader_name && <span className="project-hours-accordion__leader">Líder asignado: {row.leader_name}</span>}
								</div>
							</td>

							{months.map((monthKey) => renderMonthCell(row.months?.[monthKey]?.hours ?? 0, monthHours?.[monthKey] ?? 160, `${row.user_id}-${monthKey}`))}

							<td className="project-hours-accordion__cell project-hours-accordion__total-cell">
								<strong>{row.total_hours.toFixed(1)}h</strong>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)

	const renderKpiTable = () => (
		<div className="project-hours-accordion__wrapper">
			<table className="project-hours-accordion__table">
				<thead>
					<tr>
						<th>Usuario</th>

						<th>Rol</th>

						{months.map((monthKey) => (
							<th key={monthKey}>
								<div className="project-hours-accordion__month-header">
									<span>{monthKey}</span>

									<small>{monthHours?.[monthKey] ?? 160}h</small>
								</div>
							</th>
						))}
					</tr>
				</thead>

				<tbody>
					{paginatedRows.map((row: ProjectUserHoursDto) => (
						<tr key={row.user_id} className="project-hours-accordion__row">
							<td className="project-hours-accordion__cell">
								<strong className="project-hours-accordion__user-name">{row.user_name}</strong>
							</td>

							<td className="project-hours-accordion__cell">
								<span className={`project-hours-accordion__role ${getRoleClass(row.role_short)}`}>{row.role_short ?? 'N/A'}</span>
							</td>

							{months.map((monthKey) => {
								const hours = row.months?.[monthKey]?.hours ?? 0

								const max = monthHours?.[monthKey] ?? 160

								const percentage = max > 0 ? (hours / max) * 100 : 0

								return (
									<td key={`${row.user_id}-${monthKey}`} className="project-hours-accordion__cell">
										<div className="project-hours-accordion__kpi-cell">
											<strong>{percentage.toFixed(0)}%</strong>

											<div className="project-hours-accordion__kpi-bar">
												<div
													className={`project-hours-accordion__kpi-fill ${percentage > 100 ? 'is-danger' : percentage > 70 ? 'is-warning' : 'is-success'}`}
													style={{
														width: `${Math.min(percentage, 100)}%`,
													}}
												/>
											</div>

											<small>{hours.toFixed(1)}h</small>
										</div>
									</td>
								)
							})}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)

	return (
		<div className={`project-detail-accordion ${open ? 'is-open' : ''}`}>
			<button className="project-detail-accordion__header" onClick={onToggle}>
				<strong>Visualización de horas</strong>

				<span className="material-icons">schedule</span>
			</button>

			<div className={`project-detail-accordion__content project-detail-accordion__content--full ${open ? 'is-open' : 'is-closed'}`}>
				<div>
					{loading ? (
						<div className="project-hours-accordion__loader">
							<SectionLoader text="Procesando horas del proyecto..." />
						</div>
					) : !rows.length ? (
						<div className="project-hours-accordion__empty">
							<span className="material-icons">groups</span>

							<p>No hay usuarios asignados al proyecto.</p>
						</div>
					) : (
						<div className="project-hours-accordion">
							<div className="project-hours-accordion__header">
								<div className="project-hours-accordion__view-toggle">
									<button className={`project-hours-accordion__view-btn ${viewMode === 'details' ? 'is-active' : ''}`} onClick={() => setViewMode('details')}>
										<span className="material-icons">groups</span>

										<span>Detalle</span>
									</button>

									<button className={`project-hours-accordion__view-btn ${viewMode === 'kpis' ? 'is-active' : ''}`} onClick={() => setViewMode('kpis')}>
										<span className="material-icons">monitoring</span>

										<span>KPIs</span>
									</button>
								</div>
							</div>

							{viewMode === 'details' ? renderDetailTable() : renderKpiTable()}

							{totalPages > 1 && (
								<div className="project-hours-accordion__pagination">
									<button disabled={page <= 1} onClick={() => setPage((prev) => prev - 1)}>
										Anterior
									</button>

									<span>
										Página {page} de {totalPages}
									</span>

									<button disabled={page >= totalPages} onClick={() => setPage((prev) => prev + 1)}>
										Siguiente
									</button>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default ProjectHoursAccordion
