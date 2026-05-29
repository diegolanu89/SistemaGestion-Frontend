import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import logger from '../../base/controllers/Logger.c'

import { LogTag } from '../../base/model/LogTag.m'

const ReportsHeader: FC = () => {
	const navigate = useNavigate()

	const handleBack = () => {
		logger.infoTag(LogTag.Navigation, '[REPORTS] Back navigation')

		navigate(-1)
	}

	return (
		<div className="reports-header">
			<div className="reports-header__left">
				<button className="reports-header__back" onClick={handleBack} data-tooltip="Volver">
					<span className="material-icons">arrow_back</span>
				</button>

				<div className="reports-header__titles">
					<h1 className="reports-header__title">Reportería</h1>

					<p className="reports-header__subtitle">Generá y exportá reportes operativos relacionados con proyectos, recursos y carga de horas.</p>
				</div>
			</div>
		</div>
	)
}

export default ReportsHeader
