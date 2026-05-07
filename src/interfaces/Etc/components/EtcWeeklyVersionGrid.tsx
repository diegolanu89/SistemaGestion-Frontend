// components/EtcWeeklyVersionGrid.tsx

import { FC } from 'react'

import type { UserRefDto } from '../../EstimatedProjects/models/EstimatedProjectDTO.m'

interface Props {
	users: UserRefDto[]
	months: string[]
	values: Record<number, Record<string, number>>
	onChange: (userId: number, month: string, value: number) => void
}

export const EtcWeeklyVersionGrid: FC<Props> = ({ users, months, values, onChange }) => {
	return (
		<div className="etc-weekly-grid">
			<table className="etc-weekly-grid__table">
				<thead>
					<tr>
						<th>Usuario</th>

						{months.map((month) => (
							<th key={month}>{month}</th>
						))}

						<th>Total</th>
					</tr>
				</thead>

				<tbody>
					{users.map((user) => {
						const total = months.reduce((acc, month) => acc + (values[user.Id]?.[month] ?? 0), 0)

						return (
							<tr key={user.Id}>
								<td>{user.FullName}</td>

								{months.map((month) => (
									<td key={month}>
										<input type="number" min={0} value={values[user.Id]?.[month] ?? 0} onChange={(e) => onChange(user.Id, month, Number(e.target.value))} />
									</td>
								))}

								<td>
									<strong>{total}</strong>
								</td>
							</tr>
						)
					})}
				</tbody>
			</table>
		</div>
	)
}
