import { FC, useState } from 'react'
import { DashboardEvmComputedGroup } from '../hooks/useDashboardEvmController.h'
import { DashboardEvmRowDto } from '../models/DashboardEvmDTO.m'
import { DashboardEvmRow } from './DashboardEvmRow'

export type DateMode = 'I' | 'P' | 'R'

const DATE_MODE_META: Record<DateMode, string> = {
	I: 'Fecha de inicio',
	P: 'Fin planificado',
	R: 'Fin real',
}

interface Props {
	groups: DashboardEvmComputedGroup[]
	onOpenChanges: (row: DashboardEvmRowDto) => void
	onOpenTracking: (row: DashboardEvmRowDto) => void
}

export const DashboardEvmTable: FC<Props> = ({ groups, onOpenChanges, onOpenTracking }) => {
	const [dateMode, setDateMode] = useState<DateMode>('I')

	if (groups.length === 0) {
		return <div className="dashboard-evm-table__empty">No hay proyectos que coincidan con los filtros</div>
	}

	return (
		<div className="dashboard-evm-table-wrapper">
			<table className="dashboard-evm-table">
				<thead>
					<tr>
						<th className="dashboard-evm-table__th-client">Cliente</th>
						<th className="dashboard-evm-table__th-project">Proyecto</th>
						<th className="dashboard-evm-table__th-cc">Control cambios</th>
						<th className="dashboard-evm-table__th-date">
							<div className="dashboard-evm-table__date-header">
								<span>Fecha</span>
								<div className="dashboard-evm-table__date-header-chips">
									{(['I', 'P', 'R'] as DateMode[]).map((mode) => (
										<button
											key={mode}
											type="button"
											className={`dashboard-evm-chip dashboard-evm-chip--date ${dateMode === mode ? 'dashboard-evm-chip--date-on' : 'dashboard-evm-chip--date-off'}`}
											onClick={() => setDateMode(mode)}
											data-tooltip={DATE_MODE_META[mode]}
											aria-label={DATE_MODE_META[mode]}
										>
											{mode}
										</button>
									))}
								</div>
							</div>
						</th>
						<th className="dashboard-evm-table__th-numeric">BAC</th>
						<th className="dashboard-evm-table__th-numeric">AC</th>
						<th className="dashboard-evm-table__th-numeric">ETC</th>
						<th className="dashboard-evm-table__th-numeric">EAC</th>
						<th className="dashboard-evm-table__th-numeric">VAC</th>
					</tr>
				</thead>

				<tbody>
					{groups.flatMap((group) =>
						group.rows.map((row, idx) => (
							<DashboardEvmRow
								key={row.row.id}
								row={row}
								dateMode={dateMode}
								clientName={idx === 0 ? group.clientName : null}
								onOpenChanges={onOpenChanges}
								onOpenTracking={onOpenTracking}
							/>
						))
					)}
				</tbody>
			</table>
		</div>
	)
}
