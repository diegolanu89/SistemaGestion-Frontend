// components/ProyectHeaderView.tsx

import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'
import { IDLE_PATHS } from '../../Idle/routes/paths'

export const ProyectHeaderView: FC = () => {
	const navigate = useNavigate()

	const handleBack = () => {
		logger.infoTag(LogTag.Navigation, '[PROJECT] Navigate to home')

		navigate(IDLE_PATHS.HOME)
	}

	return (
		<div className="proyect-header">
			<div className="proyect-header__left">
				<button className="proyect-header__back" onClick={handleBack} data-tooltip="Ir al inicio">
					<span className="material-icons">arrow_back</span>
				</button>

				<div className="proyect-header__titles">
					<h1 className="proyect-header__title">Visualización de Proyectos</h1>

					<p className="proyect-header__subtitle">
						Exploración y seguimiento integral de proyectos activos, pausados y cerrados. Permite visualizar métricas EVM, capacidad operativa, estimaciones ETC
						y estado general de planificación.
					</p>
				</div>
			</div>
		</div>
	)
}

export default ProyectHeaderView
