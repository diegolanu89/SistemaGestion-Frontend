import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ProjectDto } from '../models/ProyectViewDTO.m'

import { PROYECT_PATHS_VIEWS } from '../routes/paths'
import { ETC_LOAD_PROJECT } from '../../Etc/routes/paths'

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'

import { useProyectViewController } from '../hooks/useProyectViewController.h'

interface Props {
	project: ProjectDto
}

export const ProyectViewItemHeader: FC<Props> = ({ project }) => {
	const navigate = useNavigate()

	const { recalculateProjectHours } = useProyectViewController()

	const [recalculating, setRecalculating] = useState(false)

	const goToEtc = (): void => {
		logger.infoTag(LogTag.Navigation, '[PROJECT] Navigate to ETC', {
			projectId: project.id,
		})

		navigate(ETC_LOAD_PROJECT.ETC_LOAD, {
			state: {
				projectId: project.id,
			},
		})
	}

	const handleRecalculateHours = async (): Promise<void> => {
		if (recalculating) {
			return
		}

		try {
			setRecalculating(true)

			await recalculateProjectHours(project.id)
		} finally {
			setRecalculating(false)
		}
	}

	return (
		<header className="project-detail-header">
			<div className="project-detail-header__top">
				<div className="project-detail-header__left">
					<button className="project-detail-header__back" onClick={() => navigate(PROYECT_PATHS_VIEWS.PROYECT_VIEW)} data-tooltip="Volver a proyectos">
						<span className="material-icons">arrow_back</span>
					</button>

					<div className="project-detail-header__titles">
						<h1 className="project-detail-header__title">
							{project.name}
						</h1>

						<p className="project-detail-header__subtitle">
							Visualización integral del proyecto, métricas EVM, costos, horas, capacidad operativa y planificación ETC.
						</p>
					</div>
				</div>

				<span className={`project-detail-header__status project-detail-header__status--${project.status}`}>{project.status}</span>
			</div>

			<div className="project-detail-header__bottom">
				<div className="project-detail-header__client">
					Cliente: <strong>{project.clientName ?? '-'}</strong>
				</div>

				<div className="project-detail-header__actions">
					<button onClick={() => void handleRecalculateHours()} disabled={recalculating} data-tooltip="Recalcular horas cargadas del proyecto">
						<span className="material-icons">{recalculating ? 'hourglass_top' : 'calculate'}</span>

						<span>{recalculating ? 'Recalculando...' : 'Recalcular horas'}</span>
					</button>

					<button onClick={goToEtc} data-tooltip="Abrir carga de estimación ETC">
						<span className="material-icons">edit_calendar</span>

						<span>Carga ETC</span>
					</button>
				</div>
			</div>
		</header>
	)
}

export default ProyectViewItemHeader
