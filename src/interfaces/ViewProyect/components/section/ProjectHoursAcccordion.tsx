import { FC, useMemo, useState } from 'react'

import { SectionLoader } from '../../../base/components/loading/SectionLoader'

import { ProjectDto } from '../../models/ProyectViewDTO.m'

import { useClockifyHours } from '../../hooks/useClockifyHours.h'
import { useProjectHours } from '../../hooks/useProjectHours.h'

import { ProjectHoursDetailTable } from './ProjectHoursDetailTable'
import { ProjectHoursKpiTable } from './ProjectHoursKpiTable'

interface Props {
	project: ProjectDto

	open: boolean

	onToggle: () => void
}

type ViewMode = 'details' | 'kpis'

const PAGE_SIZE = 6

const ProjectHoursAccordion: FC<Props> = ({ project, open, onToggle }) => {
	const [viewMode, setViewMode] = useState<ViewMode>('details')

	const [page, setPage] = useState(1)

	const { loading, hoursData } = useProjectHours({
		projectId: project.id,
		open,
	})

	const { clockifyHoursData } = useClockifyHours({
		projectId: project.id,
		projectName: project.name,
		open,
	})

	const rows = hoursData?.data ?? []

	const months = hoursData?.months ?? []

	const monthHours = hoursData?.month_hours ?? {}

	const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))

	const paginatedRows = useMemo(() => {
		const start = (page - 1) * PAGE_SIZE

		return rows.slice(start, start + PAGE_SIZE)
	}, [rows, page])

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

							{viewMode === 'details' ? (
								<ProjectHoursDetailTable rows={paginatedRows} months={months} monthHours={monthHours} clockifyHoursData={clockifyHoursData} />
							) : (
								<ProjectHoursKpiTable rows={paginatedRows} months={months} monthHours={monthHours} clockifyHoursData={clockifyHoursData} />
							)}

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
