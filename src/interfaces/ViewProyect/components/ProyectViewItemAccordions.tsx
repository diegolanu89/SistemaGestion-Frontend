import { FC, useState } from 'react'
import { ProjectDto } from '../models/ProyectViewDTO.m'
import ProjectChangesAccordion from './section/ProjectChangesAccordion'
import ProjectHoursAccordion from './section/ProjectHoursAcccordion'
import ProjectTrackingAccordion from './section/ProjectTrackingAccordion'

interface Props {
	project: ProjectDto
}

export const ProyectViewItemAccordions: FC<Props> = ({ project }) => {
	const [open, setOpen] = useState<Record<string, boolean>>({})

	const toggle = (key: string) => {
		setOpen((prev) => ({
			...prev,

			[key]: !prev[key],
		}))
	}

	return (
		<div className="project-detail-accordions">
			<ProjectHoursAccordion project={project} open={Boolean(open.hours)} onToggle={() => toggle('hours')} />

			<ProjectTrackingAccordion project={project} open={Boolean(open.tracking)} onToggle={() => toggle('tracking')} />

			<ProjectChangesAccordion project={project} open={Boolean(open.changes)} onToggle={() => toggle('changes')} />
		</div>
	)
}

export default ProyectViewItemAccordions
