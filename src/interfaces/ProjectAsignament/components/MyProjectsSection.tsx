// components/MyProjectsSection.tsx

import { FC } from 'react'

import ProjectAssignmentList from './ProjectAssignmentList'

import { useProjectAssignment } from '../hooks/useProjectAsignment.h'

interface Props {
	onAddProjects: () => void
}

const MyProjectsSection: FC<Props> = ({ onAddProjects }) => {
	const { assignedProjects, selectedFilters } = useProjectAssignment()

	// =========================================================
	// 🔹 FILTERS
	// =========================================================

	const showProjects = selectedFilters.includes('projects')

	// =========================================================
	// 🔹 TOTAL
	// =========================================================

	const totalAssignedProjects = assignedProjects.length

	// =========================================================
	// 🔹 HIDE
	// =========================================================

	if (!showProjects) {
		return null
	}

	// =========================================================
	// 🔹 RENDER
	// =========================================================

	return (
		<section className="my-projects-section">
			<div className="my-projects-section__header">
				<div className="my-projects-section__title">
					<h2>Mis proyectos</h2>

					<span>
						{totalAssignedProjects} {totalAssignedProjects === 1 ? 'proyecto asignado' : 'proyectos asignados'}
					</span>
				</div>

				<button type="button" className="my-projects-section__button" onClick={onAddProjects}>
					<span className="material-icons">add</span>

					<span>Agregar proyectos</span>
				</button>
			</div>

			<ProjectAssignmentList />
		</section>
	)
}

export default MyProjectsSection
