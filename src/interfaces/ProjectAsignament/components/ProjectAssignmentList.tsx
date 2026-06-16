import { FC } from 'react'

import ProjectAssignmentCard from './ProjectAssignmentCard'
import { ProjectDto } from '../../ViewProyect/models/ProyectViewDTO.m'

interface Props {
	projects: ProjectDto[]
}

const ProjectAssignmentList: FC<Props> = ({ projects }) => {
	if (projects.length === 0) {
		return (
			<div className="project-assignment-list project-assignment-list--empty">
				<span className="material-icons">folder_off</span>

				<p>No tenés proyectos visibles configurados.</p>
			</div>
		)
	}

	return (
		<div className="project-assignment-list">
			{projects.map((project) => (
				<ProjectAssignmentCard key={project.id} project={project} />
			))}
		</div>
	)
}

export default ProjectAssignmentList
