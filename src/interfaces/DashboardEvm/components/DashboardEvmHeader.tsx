import { FC } from 'react'
import RefreshButton from '../../base/components/RefreshButton/RefreshButton'

interface Props {
	onRefresh: () => void
	disabled?: boolean
}

export const DashboardEvmHeader: FC<Props> = ({ onRefresh, disabled }) => (
	<header className="dashboard-evm__header">
		<div className="dashboard-evm__header-text">
			<h1>Dashboard EVM</h1>
			<p>Métricas de proyectos agrupadas por cliente</p>
		</div>

		<div className="dashboard-evm__header-actions">
			<RefreshButton onClick={onRefresh} disabled={disabled} tooltip="Actualizar dashboard" />
		</div>
	</header>
)
