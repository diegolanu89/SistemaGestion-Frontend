import { FC } from 'react'
import AddProjectsModal from '../components/AddProjectsModal'
import MyProjectsSection from '../components/MyProjectsSection'
import ProjectAssignmentHeader from '../components/ProjectAssignmentHeader'
import ProjectAssignmentSearch from '../components/ProjectAssignmentSearch'
import { useProjectAssignmentController } from '../hooks/useAsignmentController.h'

export const ProjectAssignment: FC = () => {
	const { isModalOpen, openModal, closeModal } = useProjectAssignmentController()

	return (
		<div className="project-assignment">
			<ProjectAssignmentHeader />

			<ProjectAssignmentSearch />

			<MyProjectsSection onAddProjects={openModal} />

			<AddProjectsModal open={isModalOpen} onClose={closeModal} />
		</div>
	)
}

export default ProjectAssignment
