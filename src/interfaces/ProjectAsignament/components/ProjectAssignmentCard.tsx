interface Props {
	project: {
		id: number
		name: string
		client: string
		code: string
		users: number
	}
}

const ProjectAssignmentCard = ({ project }: Props) => {
	return (
		<div className="project-assignment-card">
			<div className="project-assignment-card__top">
				<div>
					<h3>{project.name}</h3>

					<span>{project.client}</span>
				</div>

				<div className="project-assignment-card__badge">{project.code}</div>
			</div>

			<div className="project-assignment-card__bottom">
				<div>
					<span className="material-icons">group</span>

					<span>{project.users} usuarios asignados</span>
				</div>
			</div>
		</div>
	)
}

export default ProjectAssignmentCard
