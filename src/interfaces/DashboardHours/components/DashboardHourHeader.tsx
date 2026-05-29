// components/DashboardHourHeader.tsx

import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import logger from '../../base/controllers/Logger.c'

import { LogTag } from '../../base/model/LogTag.m'

export const DashboardHourHeader: FC = () => {
	const navigate = useNavigate()

	const handleBack = () => {
		logger.infoTag(LogTag.Navigation, '[DASHBOARD-HOURS] Back navigation')

		navigate(-1)
	}

	return (
		<div className="dashboard-hour-header">
			<div className="dashboard-hour-header__left">
				<button className="dashboard-hour-header__back" onClick={handleBack} data-tooltip="Volver">
					<span className="material-icons">arrow_back</span>
				</button>

				<div className="dashboard-hour-header__titles">
					<h1 className="dashboard-hour-header__title">Dashboard de Horas</h1>

					<p className="dashboard-hour-header__subtitle">Capacidad vs necesidad (ETC) por mes, función y detalle por usuario y proyecto.</p>
				</div>
			</div>
		</div>
	)
}

export default DashboardHourHeader
