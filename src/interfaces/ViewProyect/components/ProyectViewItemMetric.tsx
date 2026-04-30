import { FC } from 'react'
import { ProjectDto } from '../models/ProyectViewDTO.m'

interface Props {
	project: ProjectDto
}

export const ProyectViewItemMetrics: FC<Props> = ({ project }) => {
	const acTotal = project.bacTotalHours * 0.62
	const etc = project.etcHours ?? 0
	const eac = acTotal + etc
	const vac = project.bacTotalHours - eac
	const advance = project.bacTotalHours > 0 ? Math.round((acTotal / project.bacTotalHours) * 100) : 0
	const changeControl = project.bacTotalHours - project.bacBaseHours

	return (
		<div className="project-detail-metrics">
			<div className="project-detail-metric project-detail-metric--bac">
				<span className="project-detail-metric__label">BAC total</span>
				<strong>{project.bacTotalHours}h</strong>

				<div className="project-detail-metric__separator" />

				<div className="project-detail-metric__row">
					<span>BAC original</span>
					<strong>{project.bacBaseHours}h</strong>
				</div>

				<div className="project-detail-metric__row">
					<span>Control cambios</span>
					<strong>{changeControl}h</strong>
				</div>
			</div>

			<div className="project-detail-metric project-detail-metric--ac" data-tooltip="Costo actual acumulado en horas">
				<span className="project-detail-metric__label">AC total</span>
				<strong>{acTotal.toFixed(1)}h</strong>
			</div>

			<div className="project-detail-metric project-detail-metric--etc" data-tooltip="Estimación restante para completar el proyecto">
				<span className="project-detail-metric__label">ETC</span>
				<strong>{etc}h</strong>
			</div>

			<div className="project-detail-metric project-detail-metric--eac" data-tooltip="Estimación total al finalizar">
				<span className="project-detail-metric__label">EAC</span>
				<strong>{eac.toFixed(1)}h</strong>
			</div>

			<div className="project-detail-metric project-detail-metric--vac" data-tooltip="Variación estimada contra BAC">
				<span className="project-detail-metric__label">VAC</span>
				<strong>{vac.toFixed(1)}h</strong>
			</div>

			<div className="project-detail-metric project-detail-metric--advance" data-tooltip="Avance calculado como AC sobre BAC">
				<span className="project-detail-metric__label">Avance</span>
				<strong>%{advance}</strong>
			</div>
		</div>
	)
}
