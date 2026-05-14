// components/EtcWeeklyVersionGrid.tsx

import { FC } from 'react'

import { useEtcWeeklyVersionController } from '../hooks/useEtcWeelyVersionController.h'

const getInitials = (fullName: string): string => {
	return fullName
		.split(' ')
		.filter(Boolean)
		.slice(0, 2)
		.map((word) => word[0]?.toUpperCase())
		.join('')
}

export const EtcWeeklyVersionGrid: FC = () => {
	const { selectedUsers, selectedMonths, values, updateHours } = useEtcWeeklyVersionController()

	return (
		<div className="etc-weekly-grid">
			<table className="etc-weekly-grid__table">
				<thead>
					<tr>
						<th></th>

						<th>Usuario</th>

						{selectedMonths.map((month) => (
							<th key={month}>{month}</th>
						))}

						<th>Total</th>
					</tr>
				</thead>

				<tbody>
					{selectedUsers.map((user) => {
						const total = selectedMonths.reduce((acc, month) => acc + (values[user.Id]?.[month] ?? 0), 0)

						return (
							<tr key={user.Id}>
								<td className="etc-weekly-grid__avatar-cell">
									<div className="etc-weekly-grid__avatar">{getInitials(user.FullName)}</div>
								</td>

								<td>{user.FullName}</td>

								{selectedMonths.map((month) => (
									<td key={month}>
										<input type="number" min={0} value={values[user.Id]?.[month] ?? 0} onChange={(e) => updateHours(user.Id, month, Number(e.target.value))} />
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
