import { FC } from 'react'
import { DashboardEvmComputedRow } from '../hooks/useDashboardEvmController.h'
import { DashboardEvmRowDto } from '../models/DashboardEvmDTO.m'
import { DashboardEvmChangeControlCell } from './DashboardEvmChangeControlCell'

interface Props {
	row: DashboardEvmComputedRow
	clientName: string | null
	onOpenChanges: (row: DashboardEvmRowDto) => void
	onOpenTracking: (row: DashboardEvmRowDto) => void
}

const formatHours = (value: number): string => value.toLocaleString('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

export const DashboardEvmRow: FC<Props> = ({ row, clientName, onOpenChanges, onOpenTracking }) => {
	const { row: project, metrics } = row
	const vacClass = metrics.vac < 0 ? 'is-negative' : 'is-positive'

	return (
		<tr className="dashboard-evm-table__row">
			<td className="dashboard-evm-table__client">{clientName ?? ''}</td>

			<td className="dashboard-evm-table__project">
				<div className="dashboard-evm-table__project-content">
					<span className="dashboard-evm-table__project-name">
						{project.code ? `${project.code} - ${project.name}` : project.name}
					</span>

					<div className="dashboard-evm-table__project-chips">
						<span className={`dashboard-evm-chip dashboard-evm-chip--status dashboard-evm-chip--${project.status}`}>● {project.status.toUpperCase()}</span>
						<button
							type="button"
							className={`dashboard-evm-chip dashboard-evm-chip--seg ${project.hasTracking ? 'dashboard-evm-chip--seg-on' : 'dashboard-evm-chip--seg-off'}`}
							onClick={() => onOpenTracking(project)}
							data-tooltip={project.hasTracking ? 'Ver seguimiento' : 'Sin seguimiento registrado'}
							aria-label="Ver seguimiento del proyecto"
						>
							S
						</button>
					</div>
				</div>
			</td>

			<td className="dashboard-evm-table__cc">
				<DashboardEvmChangeControlCell count={project.changesCount} onOpen={() => onOpenChanges(project)} />
			</td>

			<td className="dashboard-evm-table__numeric">{formatHours(metrics.bac)}</td>
			<td className="dashboard-evm-table__numeric">{formatHours(metrics.ac)}</td>
			<td className="dashboard-evm-table__numeric">{formatHours(metrics.etc)}</td>
			<td className="dashboard-evm-table__numeric">{formatHours(metrics.eac)}</td>
			<td className={`dashboard-evm-table__numeric dashboard-evm-table__vac ${vacClass}`}>{formatHours(metrics.vac)}</td>
		</tr>
	)
}
