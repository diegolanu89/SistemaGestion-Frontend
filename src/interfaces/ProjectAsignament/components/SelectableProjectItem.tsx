import { FC } from 'react'

import { useProjectAssignment } from '../hooks/useProjectAsignment.h'

import { ProjectDto } from '../../ViewProyect/models/ProyectViewDTO.m'

import logger from '../../base/controllers/Logger.c'

import { LogTag } from '../../base/model/LogTag.m'

import { VisibleProjectDto } from '../models/VisibleProject.m'

interface Props {
	project: ProjectDto
}

const SelectableProjectItem: FC<Props> = ({ project }) => {
	const { assignedProjects, setAssignedProjects } = useProjectAssignment()

	const checked = assignedProjects.some((item) => Number(item.project_id) === Number(project.id))

	const toggleProject = () => {
		if (checked) {
			logger.infoTag(LogTag.View, `[PROJECT_ASSIGNMENT] Removing visible project -> ${project.id} (${project.name})`)

			setAssignedProjects((previous) => previous.filter((item) => Number(item.project_id) !== Number(project.id)))

			return
		}

		logger.infoTag(LogTag.View, `[PROJECT_ASSIGNMENT] Adding visible project -> ${project.id} (${project.name})`)

		const visibleProject: VisibleProjectDto = {
			id: 0,
			project_id: Number(project.id),
			project: {
				id: Number(project.id),
				name: project.name,
				code: project.code ?? '',
				status: project.status ?? '',
				client_name: project.clientName ?? '',
				client: {
					name: project.clientName ?? '',
				},
			},
		}

		setAssignedProjects((previous) => [...previous, visibleProject])
	}

	return (
		<div className={`selectable-project-item ${checked ? 'is-selected' : ''}`} onClick={toggleProject}>
			<input type="checkbox" checked={checked} readOnly />

			<div>
				<h3>{project.name}</h3>

				<p>
					{project.clientName ?? 'Sin cliente'} • {project.code ?? 'Sin código'}
				</p>
			</div>
		</div>
	)
}

export default SelectableProjectItem
