import { FC } from 'react'
import { DashboardHoursRowDto } from '../../model/DashboardHoursDTO.m'
import { DashboardHoursMainRow } from './DashboardHoursMainRow'

interface Props {
	rows: DashboardHoursRowDto[]

	months: string[]

	monthHours: Record<string, number>

	expandedUsers: Record<number, boolean>

	onToggleUser: (userId: number) => void
}

export const DashboardHoursDetailsTable: FC<Props> = ({ rows, months, monthHours, expandedUsers, onToggleUser }) => {
	return (
		<div className="dashboard-hours-table__wrapper">
			<table className="dashboard-hours-table">
				<thead>
					<tr>
						<th>Usuario</th>

						<th>Cliente</th>

						<th>Proyecto</th>

						{months.map((monthKey) => (
							<th key={monthKey}>
								<div className="dashboard-hours-table__month-header">
									<span>{monthKey}</span>
								</div>
							</th>
						))}

						<th>Total</th>
					</tr>
				</thead>

				<tbody>
					{rows.map((row) => (
						<DashboardHoursMainRow
							key={row.user_id}
							row={row}
							months={months}
							monthHours={monthHours}
							expanded={!!expandedUsers[row.user_id]}
							onToggleUser={onToggleUser}
						/>
					))}
				</tbody>
			</table>
		</div>
	)
}
