// components/ProjectAssignmentHeader.tsx

import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProjectAssignmentController } from '../hooks/useAsignmentController.h'
import { IDLE_PATHS } from '../../Idle/routes/paths'
import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'

const ProjectAssignmentHeader: FC = () => {
	const { projects, refetch } = useProjectAssignmentController()
	const navigate = useNavigate()

	const total = projects.length

	return (
		<div className="project-assignment-header">
			<div className="proyect-header__left">
				<button className="proyect-header__back" onClick={() => { logger.infoTag(LogTag.Navigation, '[PROJECT_ASSIGNMENT] Navigate to home'); navigate(IDLE_PATHS.HOME) }} data-tooltip="Ir al inicio">
					<span className="material-icons">arrow_back</span>
				</button>

				<div className="project-assignment-header__content">
					<h1>Mis Proyectos</h1>

					<p>Consultá los proyectos asignados a tu usuario y mantené sincronizada la información disponible para los dashboards y reportes.</p>

					<div className="project-assignment-header__meta">
						<span>
							{total} {total === 1 ? 'proyecto disponible' : 'proyectos disponibles'}
						</span>
					</div>
				</div>
			</div>

			<button type="button" className="project-assignment-header__button" onClick={() => void refetch()}>
				<span className="material-icons">sync</span>

				<span>Sincronizar proyectos</span>
			</button>
		</div>
	)
}

export default ProjectAssignmentHeader
