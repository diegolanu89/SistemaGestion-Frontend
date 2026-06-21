import { FC } from 'react'
import { DashboardEvmComputedGroup } from '../hooks/useDashboardEvmController.h'
import { DashboardEvmRowDto } from '../models/DashboardEvmDTO.m'
import { DashboardEvmRow } from './DashboardEvmRow'

interface Props {
	groups: DashboardEvmComputedGroup[]
	onOpenChanges: (row: DashboardEvmRowDto) => void
	onOpenTracking: (row: DashboardEvmRowDto) => void
}

export const DashboardEvmTable: FC<Props> = ({ groups, onOpenChanges, onOpenTracking }) => {
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
						<th>Fecha inicio</th>
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
