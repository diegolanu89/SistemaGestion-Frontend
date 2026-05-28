import ProjectAssignmentCard from './ProjectAssignmentCard'

const MOCK_PROJECTS = [
	{
		id: 1,
		name: 'BDT EVM Backend',
		client: 'BDT',
		code: 'EVM-001',
		users: 8,
	},

	{
		id: 2,
		name: 'Dashboard Horas',
		client: 'BDT',
		code: 'HRS-002',
		users: 5,
	},
]

const ProjectAssignmentList = () => {
	return (
		<div className="project-assignment-list">
			{MOCK_PROJECTS.map((project) => (
				<ProjectAssignmentCard key={project.id} project={project} />
			))}
		</div>
	)
}

export default ProjectAssignmentList
