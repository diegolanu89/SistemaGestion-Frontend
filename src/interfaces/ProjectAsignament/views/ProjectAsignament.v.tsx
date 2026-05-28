import { FC } from 'react'
import AddProjectsModal from '../components/AddProjectsModal'
import MyProjectsSection from '../components/MyProjectsSection'
import ProjectAssignmentFilters from '../components/ProjectAssignmentFilters'
import ProjectAssignmentHeader from '../components/ProjectAssignmentHeader'
import ProjectAssignmentSearch from '../components/ProjectAssignmentSearch'
import { useProjectAssignmentController } from '../hooks/useAsignmentController.h'

export const ProjectAssignment: FC = () => {
	const {
		projects,

		isModalOpen,

		openModal,
		closeModal,
	} = useProjectAssignmentController()

	return (
		<div className="project-assignment">
			<ProjectAssignmentHeader total={projects.length} onCreate={openModal} />

			<ProjectAssignmentFilters />

			<ProjectAssignmentSearch />

			<MyProjectsSection onAddProjects={openModal} />

			<AddProjectsModal open={isModalOpen} onClose={closeModal} />
		</div>
	)
}

export default ProjectAssignment
