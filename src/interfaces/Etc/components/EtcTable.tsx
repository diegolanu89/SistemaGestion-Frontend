// components/EtcTable.tsx

import { FC, useMemo } from 'react'
import { useEtcContext } from '../hooks/useEtcContext.h'
import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'

export const EtcTable: FC = () => {
	const { entries } = useEtcContext()

	// =========================
	// GROUP DATA
	// =========================

	const { users, months, matrix, totalsByUser, totalGeneral } = useMemo(() => {
		const users = Array.from(new Set(entries.map((e) => e.userName)))
		const months = Array.from(new Set(entries.map((e) => e.monthKey)))

		const matrix: Record<string, Record<string, number>> = {}

		let totalGeneral = 0

		users.forEach((user) => {
			matrix[user] = {}
			months.forEach((month) => {
				matrix[user][month] = 0
			})
		})

		entries.forEach((e) => {
			matrix[e.userName][e.monthKey] += Number(e.hours)
		})

		const totalsByUser: Record<string, number> = {}

		users.forEach((user) => {
			const total = months.reduce((acc, m) => acc + matrix[user][m], 0)
			totalsByUser[user] = total
			totalGeneral += total
		})

		return { users, months, matrix, totalsByUser, totalGeneral }
	}, [entries])

	// =========================
	// ACTION
	// =========================

	const handleEdit = (user: string) => {
		logger.infoTag(LogTag.Navigation, '[ETC] Edit user row', { user })
	}

	return (
		<div className="etc-table">
			<table className="etc-table__table">
				<thead>
					<tr>
						<th>Usuario</th>

						{months.map((month) => (
							<th key={month}>{month}</th>
						))}

						<th>Total</th>
						<th>Acciones</th>
					</tr>
				</thead>

				<tbody>
					{users.map((user) => (
						<tr key={user}>
							<td>{user}</td>

							{months.map((month) => (
								<td key={month}>{matrix[user][month] || '-'}</td>
							))}

							<td className="etc-table__total">{totalsByUser[user]}</td>

							<td>
								<button className="etc-table__action-btn" onClick={() => handleEdit(user)}>
									<span className="material-icons etc-table__icon">edit</span>
								</button>
							</td>
						</tr>
					))}
				</tbody>

				<tfoot>
					<tr>
						<td colSpan={months.length + 1}>
							<strong>Total General</strong>
						</td>

						<td className="etc-table__grand-total">
							<strong>{totalGeneral}</strong>
						</td>

						<td />
					</tr>
				</tfoot>
			</table>
		</div>
	)
}
