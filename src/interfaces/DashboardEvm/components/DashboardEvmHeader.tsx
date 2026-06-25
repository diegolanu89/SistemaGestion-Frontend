import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import RefreshButton from '../../base/components/RefreshButton/RefreshButton'
import { IDLE_PATHS } from '../../Idle/routes/paths'
import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'

interface Props {
	onRefresh: () => void
	disabled?: boolean
}

export const DashboardEvmHeader: FC<Props> = ({ onRefresh, disabled }) => {
	const navigate = useNavigate()

	return (
		<header className="dashboard-evm__header">
			<div className="proyect-header__left">
				<button
					className="proyect-header__back"
					onClick={() => { logger.infoTag(LogTag.Navigation, '[DASHBOARD_EVM] Navigate to home'); navigate(IDLE_PATHS.HOME) }}
					data-tooltip="Ir al inicio"
				>
					<span className="material-icons">arrow_back</span>
				</button>

				<div className="dashboard-evm__header-text">
					<h1>Dashboard EVM</h1>
					<p>Métricas de proyectos agrupadas por cliente</p>
				</div>
			</div>

			<div className="dashboard-evm__header-actions">
				<RefreshButton onClick={onRefresh} disabled={disabled} tooltip="Actualizar dashboard" />
			</div>
		</header>
	)
}
