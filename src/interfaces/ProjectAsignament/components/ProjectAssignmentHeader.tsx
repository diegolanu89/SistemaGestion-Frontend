// components/ProjectAssignmentHeader.tsx

import { FC } from 'react'

interface Props {
	total: number

	onCreate: () => void
}

const ProjectAssignmentHeader: FC<Props> = ({ total, onCreate }) => {
	return (
		<div className="project-assignment-header">
			<div className="project-assignment-header__content">
				<h1>Asignación de Proyectos</h1>

				<p>Gestión y asignación de recursos sobre proyectos activos.</p>

				<div className="project-assignment-header__meta">
					<span>{total} proyectos visibles</span>
				</div>
			</div>

			<button type="button" className="project-assignment-header__button" onClick={onCreate}>
				<span className="material-icons">add</span>

				<span>Nueva asignación</span>
			</button>
		</div>
	)
}

export default ProjectAssignmentHeader
