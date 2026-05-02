// components/EtcHeader.tsx

import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'
import { PROYECT_PATHS_VIEWS } from '../../ViewProyect/routes/paths'

export const EtcHeader: FC = () => {
	const navigate = useNavigate()

	const handleBack = () => {
		logger.infoTag(LogTag.Navigation, '[ETC] Back to project list')

		navigate(PROYECT_PATHS_VIEWS.PROYECT_VIEW)
	}

	return (
		<div className="etc-header">
			<div className="etc-header__left">
				<button className="etc-header__back" onClick={handleBack} data-tooltip="Volver a proyectos">
					<span className="material-icons">arrow_back</span>
				</button>

				<div className="etc-header__titles">
					<h1 className="etc-header__title">Carga de ETC por Proyecto</h1>
					<p className="etc-header__subtitle">
						Estimación de horas restantes (ETC) para cada recurso y período del proyecto. Permite validar capacidad, ajustar planificación y generar snapshots
						de control.
					</p>
				</div>
			</div>
		</div>
	)
}
