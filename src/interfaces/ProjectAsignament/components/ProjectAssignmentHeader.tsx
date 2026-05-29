// components/ProjectAssignmentHeader.tsx

import { FC } from 'react'
import { useProjectAssignmentController } from '../hooks/useAsignmentController.h'

const ProjectAssignmentHeader: FC = () => {
	const { projects, refetch } = useProjectAssignmentController()

	const total = projects.length

	return (
		<div className="project-assignment-header">
			<div className="project-assignment-header__content">
				<h1>Mis Proyectos</h1>

				<p>Consultá los proyectos asignados a tu usuario y mantené sincronizada la información disponible para los dashboards y reportes.</p>

				<div className="project-assignment-header__meta">
					<span>
						{total} {total === 1 ? 'proyecto disponible' : 'proyectos disponibles'}
					</span>
				</div>
			</div>

			<button type="button" className="project-assignment-header__button" onClick={() => void refetch()}>
				<span className="material-icons">refresh</span>

				<span>Actualizar proyectos</span>
			</button>
		</div>
	)
}

export default ProjectAssignmentHeader
