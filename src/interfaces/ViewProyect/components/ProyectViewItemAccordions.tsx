import { FC, useRef, useState } from 'react'

import { ProjectDto } from '../models/ProyectViewDTO.m'

import ProjectChangesAccordion from './section/ProjectChangesAccordion'
import ProjectHoursAccordion from './section/ProjectHoursAcccordion'
import ProjectTrackingAccordion from './section/ProjectTrackingAccordion'

interface Props {
	project: ProjectDto
}

export const ProyectViewItemAccordions: FC<Props> = ({ project }) => {
	const [open, setOpen] = useState<Record<string, boolean>>({})

	const refs = {
		hours: useRef<HTMLDivElement | null>(null),
		tracking: useRef<HTMLDivElement | null>(null),
		changes: useRef<HTMLDivElement | null>(null),
	}

	const toggle = (key: keyof typeof refs) => {
		const willOpen = !open[key]

		setOpen((prev) => ({
			...prev,
			[key]: willOpen,
		}))

		if (willOpen) {
			setTimeout(() => {
				refs[key].current?.scrollIntoView({
					behavior: 'smooth',
					block: 'start',
				})
			}, 200)
		}
	}

	return (
		<div className="project-detail-accordions">
			<div ref={refs.hours}>
				<ProjectHoursAccordion project={project} open={Boolean(open.hours)} onToggle={() => toggle('hours')} />
			</div>

			<div ref={refs.tracking}>
				<ProjectTrackingAccordion project={project} open={Boolean(open.tracking)} onToggle={() => toggle('tracking')} />
			</div>

			<div ref={refs.changes}>
				<ProjectChangesAccordion project={project} open={Boolean(open.changes)} onToggle={() => toggle('changes')} />
			</div>
		</div>
	)
}

export default ProyectViewItemAccordions
