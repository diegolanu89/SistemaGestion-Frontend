import { FC, useMemo } from 'react'
import { ESTIMATED_PROJECT_CONFIG } from '../models/EstimatedProjectConfig.m'
import { UserRefDto } from '../models/EstimatedProjectDTO.m'
import { MonthSlot } from '../utils/months'
import { useEstimatedCapacity } from '../hooks/useEstimatedCapacity.h'

export type MonthlyHoursState = Record<number, Record<string, number>>

interface Props {
	months: MonthSlot[]
	monthCount: number
	onMonthCountChange: (count: number) => void
	selectedUsers: UserRefDto[]
	values: MonthlyHoursState
	onChange: (userId: number, monthKey: string, hours: number) => void
	potencialProjectId?: number | null
}

export const EstimatedProjectMonthlyGrid: FC<Props> = ({
	months,
	monthCount,
	onMonthCountChange,
	selectedUsers,
	values,
	onChange,
	potencialProjectId,
}) => {
	const { MONTHLY_GRID } = ESTIMATED_PROJECT_CONFIG.FORM

	const userNames = useMemo(() => selectedUsers.map((u) => u.FullName), [selectedUsers])
	const monthKeys = useMemo(() => months.map((m) => m.key), [months])

	const { limits, loading } = useEstimatedCapacity({ userNames, monthKeys, potencialProjectId })

	/** Cap total del proyecto por mes = Σ(available) entre los recursos seleccionados. */
	const monthAvailableSums = useMemo(() => {
		const sums: Record<string, number> = {}
		for (const m of months) {
			let s = 0
			for (const u of selectedUsers) s += limits[u.FullName]?.[m.key]?.available ?? 0
			sums[m.key] = s
		}
		return sums
	}, [months, selectedUsers, limits])

	const monthTotals = useMemo(() => {
		const totals: Record<string, number> = {}
		for (const m of months) {
			let sum = 0
			for (const u of selectedUsers) sum += values[u.Id]?.[m.key] ?? 0
			totals[m.key] = sum
		}
		return totals
	}, [months, selectedUsers, values])

	const userTotals = useMemo(() => {
		const totals: Record<number, number> = {}
		for (const u of selectedUsers) {
			let sum = 0
			for (const m of months) sum += values[u.Id]?.[m.key] ?? 0
			totals[u.Id] = sum
		}
		return totals
	}, [selectedUsers, months, values])

	const grandTotal = useMemo(() => Object.values(monthTotals).reduce((a, b) => a + b, 0), [monthTotals])

	return (
		<section className="estimated-grid">
			<header className="estimated-grid__header">
				<h3 className="estimated-grid__title">{MONTHLY_GRID.TITLE}</h3>

				<div className="estimated-grid__count">
					<label htmlFor="estimated-month-count">{MONTHLY_GRID.MONTH_COUNT_LABEL}</label>
					<input
						id="estimated-month-count"
						type="number"
						min={1}
						max={12}
						value={monthCount}
						onChange={(e) => {
							const v = Number(e.target.value)
							if (!Number.isNaN(v)) onMonthCountChange(Math.max(1, Math.min(12, v)))
						}}
					/>
					<span className="estimated-grid__hint">{MONTHLY_GRID.MONTH_COUNT_HINT}</span>
				</div>

				<p className="estimated-grid__rule">{MONTHLY_GRID.RULE_HINT}</p>
			</header>

			<div className="estimated-grid__table-wrapper">
				<table className="estimated-grid__table">
					<thead>
						<tr>
							<th className="estimated-grid__col-user">{MONTHLY_GRID.USER_COL_HEADER}</th>
							{months.map((m) => (
								<th key={m.key} className="estimated-grid__col-month">
									<div className="estimated-grid__month-name">{m.label}</div>
									<div className="estimated-grid__month-cap">({(monthAvailableSums[m.key] ?? 0).toFixed(1)}h)</div>
								</th>
							))}
							<th className="estimated-grid__col-total">{MONTHLY_GRID.TOTAL_USER_HEADER}</th>
						</tr>
					</thead>

					<tbody>
						{selectedUsers.length === 0 && (
							<tr>
								<td colSpan={months.length + 2} className="estimated-grid__empty">
									Seleccioná al menos un recurso para asignar horas.
								</td>
							</tr>
						)}

						{selectedUsers.map((user) => (
							<tr key={user.Id}>
								<td className="estimated-grid__user">{user.FullName}</td>

								{months.map((m) => {
									const limit = limits[user.FullName]?.[m.key]
									const cap = limit?.capacity ?? 0
									const etc = limit?.etc_hours ?? 0
									const other = limit?.other_potencial_hours ?? 0
									const max = limit?.available ?? 0
									const value = values[user.Id]?.[m.key] ?? 0
									const locked = max <= 0

									return (
										<td key={m.key} className="estimated-grid__cell">
											<div className="estimated-grid__cell-inner">
												<input
													type="number"
													min={0}
													max={max}
													step={1}
													value={value || ''}
													onChange={(e) => {
														const raw = Number(e.target.value)
														const safe = Number.isNaN(raw) ? 0 : Math.max(0, Math.min(max, raw))
														onChange(user.Id, m.key, safe)
													}}
													disabled={loading || locked}
												/>
												<div className="estimated-grid__max">
													{MONTHLY_GRID.MAX_PREFIX} {max}
													{MONTHLY_GRID.HOUR_SUFFIX}
												</div>

												<dl className="estimated-grid__breakdown">
													<div>
														<dt>Cap.</dt>
														<dd>{cap}h</dd>
													</div>
													<div>
														<dt>ETC</dt>
														<dd>{etc}h</dd>
													</div>
													<div>
														<dt>Otros est.</dt>
														<dd>{other}h</dd>
													</div>
												</dl>
											</div>
										</td>
									)
								})}

								<td className="estimated-grid__total estimated-grid__total--user">{userTotals[user.Id].toFixed(1)}</td>
							</tr>
						))}
					</tbody>

					{selectedUsers.length > 0 && (
						<tfoot>
							<tr>
								<td className="estimated-grid__user">{MONTHLY_GRID.TOTAL_MONTH_HEADER}</td>
								{months.map((m) => (
									<td key={m.key} className="estimated-grid__total estimated-grid__total--month">
										{(monthTotals[m.key] ?? 0).toFixed(1)}
									</td>
								))}
								<td className="estimated-grid__total estimated-grid__total--grand">{grandTotal.toFixed(1)}</td>
							</tr>
						</tfoot>
					)}
				</table>
			</div>
		</section>
	)
}
