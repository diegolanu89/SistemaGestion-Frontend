// components/EtcTable.tsx

import { FC, Fragment, useMemo } from 'react'
import { useEtcContext } from '../hooks/useEtcContext.h'
import type { EtcEntryDto } from '../model/Etc.m'

interface EtcTableProps {
	baselineEntries?: EtcEntryDto[]
	showBaseline?: boolean
}

export const EtcTable: FC<EtcTableProps> = ({ baselineEntries = [], showBaseline = false }) => {
	const { entries } = useEtcContext()

	// =========================
	// GROUP DATA
	// =========================

	const { users, months, matrix, totalsByUser, totalGeneral, baselineMatrix, baselineTotalsByUser, baselineOnlyUsers, totalBaselineGeneral } = useMemo(() => {
		const currentMonths = Array.from(new Set(entries.map((e) => e.monthKey)))
		const blMonths = showBaseline ? Array.from(new Set(baselineEntries.map((e) => e.monthKey))) : []
		const months = Array.from(new Set([...currentMonths, ...blMonths])).sort()

		const users = Array.from(new Set(entries.map((e) => e.userName)))

		const matrix: Record<string, Record<string, number>> = {}
		users.forEach((u) => {
			matrix[u] = {}
			months.forEach((m) => { matrix[u][m] = 0 })
		})
		entries.forEach((e) => { matrix[e.userName][e.monthKey] += Number(e.hours) })

		let totalGeneral = 0
		const totalsByUser: Record<string, number> = {}
		users.forEach((u) => {
			const t = months.reduce((acc, m) => acc + (matrix[u]?.[m] ?? 0), 0)
			totalsByUser[u] = t
			totalGeneral += t
		})

		const baselineUsers = showBaseline ? Array.from(new Set(baselineEntries.map((e) => e.userName))) : []
		const baselineMatrix: Record<string, Record<string, number>> = {}
		const baselineTotalsByUser: Record<string, number> = {}

		if (showBaseline) {
			baselineUsers.forEach((u) => {
				baselineMatrix[u] = {}
				months.forEach((m) => { baselineMatrix[u][m] = 0 })
			})
			baselineEntries.forEach((e) => { baselineMatrix[e.userName][e.monthKey] += Number(e.hours) })
			baselineUsers.forEach((u) => {
				baselineTotalsByUser[u] = months.reduce((acc, m) => acc + (baselineMatrix[u]?.[m] ?? 0), 0)
			})
		}

		const baselineOnlyUsers = showBaseline ? baselineUsers.filter((u) => !users.includes(u)) : []
		const totalBaselineGeneral = Object.values(baselineTotalsByUser).reduce((a, b) => a + b, 0)

		return { users, months, matrix, totalsByUser, totalGeneral, baselineMatrix, baselineTotalsByUser, baselineOnlyUsers, totalBaselineGeneral }
	}, [entries, baselineEntries, showBaseline])

	const footerLabelSpan = showBaseline ? months.length * 2 + 1 : months.length + 1

	return (
		<div className="etc-table">
			<table className="etc-table__table">
				<thead>
					{/* ── Row 1: month group headers ── */}
					<tr>
						<th className="etc-table__th--user" rowSpan={showBaseline ? 2 : 1}>
							Usuario
						</th>

						{months.map((month) =>
							showBaseline ? (
								<th key={month} colSpan={2} className="etc-table__month-header">
									{month}
								</th>
							) : (
								<th key={month} className="etc-table__month-header">
									{month}
								</th>
							)
						)}

						{showBaseline ? (
							<th colSpan={2} className="etc-table__total-header">
								Total
							</th>
						) : (
							<th className="etc-table__total-header">Total</th>
						)}
					</tr>

					{/* ── Row 2 (baseline only): Actual / LB sub-headers ── */}
					{showBaseline && (
						<tr>
							{months.map((month) => (
								<Fragment key={month}>
									<th className="etc-table__subheader">Actual</th>
									<th className="etc-table__subheader etc-table__subheader--baseline">LB</th>
								</Fragment>
							))}
							<th className="etc-table__subheader etc-table__subheader--total">Actual</th>
							<th className="etc-table__subheader etc-table__subheader--baseline">LB</th>
						</tr>
					)}
				</thead>

				<tbody>
					{/* ── Current-version users ── */}
					{users.map((user) => (
						<tr key={user}>
							<td className="etc-table__td--user">{user}</td>

							{months.map((month) => (
								<Fragment key={month}>
									<td className="etc-table__cell--value">{matrix[user]?.[month] || '-'}</td>
									{showBaseline && (
										<td className="etc-table__cell--baseline">{baselineMatrix[user]?.[month] || '-'}</td>
									)}
								</Fragment>
							))}

							<td className="etc-table__total">{totalsByUser[user]}</td>
							{showBaseline && (
								<td className="etc-table__total etc-table__cell--baseline">
									{baselineTotalsByUser[user] ?? '-'}
								</td>
							)}
						</tr>
					))}

					{/* ── Baseline-only users (removed from current version) ── */}
					{baselineOnlyUsers.map((user) => (
						<tr key={`bl-only-${user}`}>
							<td className="etc-table__td--user">
								{user}
								<span className="etc-table__baseline-badge">LB</span>
							</td>

							{months.map((month) => (
								<Fragment key={month}>
									<td className="etc-table__cell--removed">-</td>
									<td className="etc-table__cell--baseline">{baselineMatrix[user]?.[month] || '-'}</td>
								</Fragment>
							))}

							<td className="etc-table__total etc-table__cell--removed">-</td>
							<td className="etc-table__total etc-table__cell--baseline">{baselineTotalsByUser[user]}</td>
						</tr>
					))}
				</tbody>

				<tfoot>
					<tr>
						<td colSpan={footerLabelSpan}>
							<strong>Total General</strong>
						</td>

						<td className="etc-table__grand-total">
							<strong>{totalGeneral}</strong>
						</td>

						{showBaseline && (
							<td className="etc-table__grand-total etc-table__cell--baseline">
								<strong>{totalBaselineGeneral}</strong>
							</td>
						)}
					</tr>
				</tfoot>
			</table>
		</div>
	)
}
