import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProjectDto } from '../models/ProyectViewDTO.m'
import { PROYECT_PATHS_VIEWS } from '../routes/paths'
import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'

interface Props {
	project: ProjectDto
}

export const ProyectViewItemHeader: FC<Props> = ({ project }) => {
	const navigate = useNavigate()

	const goToEtc = () => {
		logger.infoTag(LogTag.Navigation, '[PROJECT] Navigate to ETC', {
			projectId: project.id,
		})

		navigate('/operaciones/etc', {
			state: { projectId: project.id },
		})
	}

	return (
		<header className="project-detail-header">
			<button className="project-detail-header__back" onClick={() => navigate(PROYECT_PATHS_VIEWS.PROYECT_VIEW)} data-tooltip="Volver al listado de proyectos">
				<span className="material-icons">arrow_back</span>
				<span>Volver a proyectos</span>
			</button>

			<div className="project-detail-header__client">
				Cliente: <strong>{project.clientName ?? '-'}</strong>
			</div>

			<div className="project-detail-header__main">
				<div>
					<h1>
						<span>{project.code ?? '-'}</span>
						<span>-</span>
						<span>{project.clientName ?? '-'}</span>
						<span>-</span>
						<span>{project.name}</span>
					</h1>

					<span className={`project-detail-header__status project-detail-header__status--${project.status}`}>{project.status}</span>
				</div>

				<div className="project-detail-header__actions">
					<button data-tooltip="Sincronizar entradas de tiempo desde Clockify">
						<span className="material-icons">refresh</span>
					</button>

					<button data-tooltip="Recalcular horas cargadas del proyecto">
						<span className="material-icons">calculate</span>
						<span>Recalcular horas</span>
					</button>

					{/* 🔥 BOTÓN ACTUALIZADO */}
					<button onClick={goToEtc} data-tooltip="Abrir carga de estimación ETC">
						<span className="material-icons">edit_calendar</span>
						<span>Carga ETC</span>
					</button>
				</div>
			</div>
		</header>
	)
}
