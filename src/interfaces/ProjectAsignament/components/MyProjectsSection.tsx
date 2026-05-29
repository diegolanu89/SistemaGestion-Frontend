import { FC } from 'react'

import ProjectAssignmentList from './ProjectAssignmentList'

import { useProjectAssignment } from '../hooks/useProjectAsignment.h'

interface Props {
	onAddProjects: () => void
}

const MyProjectsSection: FC<Props> = ({ onAddProjects }) => {
	const { assignedProjects, selectedFilters } = useProjectAssignment()

	const showProjects = selectedFilters.includes('projects')

	const totalAssignedProjects = assignedProjects.length

	if (!showProjects) {
		return null
	}

	return (
		<section className="my-projects-section">
			<div className="my-projects-section__header">
				<div className="my-projects-section__title">
					<h2>Mis proyectos</h2>

					<span>
						{totalAssignedProjects} {totalAssignedProjects === 1 ? 'proyecto visible' : 'proyectos visibles'}
					</span>
				</div>

				<button type="button" className="my-projects-section__button" onClick={onAddProjects}>
					<span className="material-icons">edit</span>

					<span>Administrar proyectos</span>
				</button>
			</div>

			<ProjectAssignmentList />
		</section>
	)
}

export default MyProjectsSection
