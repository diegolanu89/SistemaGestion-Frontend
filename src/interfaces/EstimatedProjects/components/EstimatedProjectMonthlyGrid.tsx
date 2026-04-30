import { FC, useMemo } from 'react'
import { ESTIMATED_PROJECT_CONFIG } from '../models/EstimatedProjectConfig.m'
import { UserRefDto } from '../models/EstimatedProjectDTO.m'
import { MonthSlot } from '../utils/months'
import { useEstimatedCapacity } from '../hooks/useEstimatedCapacity.h'
import { buildCapacityMap, buildWorkloadMap, computeMaxAssignable } from '../utils/capacity'

export type MonthlyHoursState = Record<number, Record<string, number>>

interface Props {
	months: MonthSlot[]
	monthCount: number
	onMonthCountChange: (count: number) => void
	selectedUsers: UserRefDto[]
	values: MonthlyHoursState
	onChange: (userId: number, monthKey: string, hours: number) => void
}

export const EstimatedProjectMonthlyGrid: FC<Props> = ({ months, monthCount, onMonthCountChange, selectedUsers, values, onChange }) => {
	const { MONTHLY_GRID } = ESTIMATED_PROJECT_CONFIG.FORM

	const userIds = useMemo(() => selectedUsers.map((u) => u.Id), [selectedUsers])
	const monthKeys = useMemo(() => months.map((m) => m.key), [months])

	const { capacities, workload, loading } = useEstimatedCapacity({ userIds, monthKeys })

	const capacityByMonth = useMemo(() => buildCapacityMap(capacities), [capacities])
	const workloadByUser = useMemo(() => buildWorkloadMap(workload), [workload])

	const monthTotals = useMemo(() => {
		const totals: Record<string, number> = {}
		for (const m of months) {
			let sum = 0
			for (const u of selectedUsers) {
				sum += values[u.Id]?.[m.key] ?? 0
			}
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
							{months.map((m) => {
								const cap = capacityByMonth.get(m.key)
								return (
									<th key={m.key} className="estimated-grid__col-month">
										<div className="estimated-grid__month-name">{m.label}</div>
										<div className="estimated-grid__month-cap">({cap !== undefined ? cap.toFixed(1) : '—'}h)</div>
									</th>
								)
							})}
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

						{selectedUsers.map((user) => {
							const userMonthMap = workloadByUser.get(user.Id)
							return (
								<tr key={user.Id}>
									<td className="estimated-grid__user">{user.FullName}</td>

									{months.map((m) => {
										const assignments = userMonthMap?.get(m.key) ?? []
										const cap = capacityByMonth.get(m.key) ?? 0
										const max = computeMaxAssignable(cap, assignments)
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

													{assignments.length > 0 && (
														<ul className="estimated-grid__chips">
															{assignments.map((a, idx) => (
																<li key={`${a.Kind}-${idx}`} className={`estimated-chip estimated-chip--${a.Kind === 'R' ? 'real' : 'estimado'}`}>
																	<span className="estimated-chip__kind">{a.Kind}</span>
																	<span className="estimated-chip__label">
																		{a.ProjectCode ? `${a.ProjectCode} - ${a.ProjectLabel}` : a.ProjectLabel}
																	</span>
																	<span className="estimated-chip__hours">
																		{a.Hours}
																		{MONTHLY_GRID.HOUR_SUFFIX}
																	</span>
																</li>
															))}
														</ul>
													)}
												</div>
											</td>
										)
									})}

									<td className="estimated-grid__total estimated-grid__total--user">{userTotals[user.Id].toFixed(1)}</td>
								</tr>
							)
						})}
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
