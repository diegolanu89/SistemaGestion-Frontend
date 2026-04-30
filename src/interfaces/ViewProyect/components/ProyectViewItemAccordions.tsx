import { FC, useState } from 'react'
import { ProjectDto } from '../models/ProyectViewDTO.m'

interface Props {
	project: ProjectDto
}

const sections = [
	{
		key: 'hours',
		title: 'Visualización de horas',
		subtitle: 'Consulta de horas cargadas, acumuladas y pendientes.',
	},
	{
		key: 'tracking',
		title: 'Seguimiento de proyecto',
		subtitle: 'Planificación, desvíos y fechas reales.',
	},
	{
		key: 'changes',
		title: 'Control de cambios',
		subtitle: 'Variaciones de alcance y ajustes sobre la línea base.',
	},
]

export const ProyectViewItemAccordions: FC<Props> = ({ project }) => {
	const [open, setOpen] = useState<Record<string, boolean>>({})

	return (
		<div className="project-detail-accordions">
			{sections.map((section) => {
				const active = open[section.key]

				return (
					<div className={`project-detail-accordion ${active ? 'is-open' : ''}`} key={section.key}>
						<button className="project-detail-accordion__header" onClick={() => setOpen((prev) => ({ ...prev, [section.key]: !prev[section.key] }))}>
							<div>
								<strong>{section.title}</strong>
								<span>{section.subtitle}</span>
							</div>

							<span className="material-icons">expand_more</span>
						</button>

						<div className="project-detail-accordion__content">
							<p>Información disponible para el proyecto {project.name}.</p>
						</div>
					</div>
				)
			})}
		</div>
	)
}
