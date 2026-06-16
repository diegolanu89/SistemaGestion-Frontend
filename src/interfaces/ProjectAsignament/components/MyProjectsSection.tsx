import { FC } from 'react'

import ProjectAssignmentList from './ProjectAssignmentList'
import MyProjectsFilters from './MyProjectsFilters'

import { useProjectAssignment } from '../hooks/useProjectAsignment.h'
import { useVisibleProjectsController } from '../hooks/useVisibleProjectController.h'

interface Props {
	onAddProjects: () => void
}

const MyProjectsSection: FC<Props> = ({ onAddProjects }) => {
	const { selectedFilters } = useProjectAssignment()
	const ctrl = useVisibleProjectsController()

	const showProjects = selectedFilters.includes('projects')

	if (!showProjects) {
		return null
	}

	return (
		<section className="my-projects-section">
			<div className="my-projects-section__header">
				<div className="my-projects-section__title">
					<h2>Mis proyectos</h2>

					<span>
						{ctrl.projects.length} {ctrl.projects.length === 1 ? 'proyecto' : 'proyectos'}
						{ctrl.hasFilters && ctrl.totalCount !== ctrl.projects.length && ` de ${ctrl.totalCount}`}
					</span>
				</div>

				<button type="button" className="my-projects-section__button" onClick={onAddProjects}>
					<span className="material-icons">edit</span>

					<span>Administrar proyectos</span>
				</button>
			</div>

			<MyProjectsFilters ctrl={ctrl} />

			<ProjectAssignmentList projects={ctrl.projects} />
		</section>
	)
}

export default MyProjectsSection
