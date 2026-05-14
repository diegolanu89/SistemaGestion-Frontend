import { FC, useEffect, useMemo, useState } from 'react'

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'
import { capacityAdapter } from '../../Capacity/service/CapacityAdapter'
import { UserRefDto } from '../models/EstimatedProjectDTO.m'
import { MonthSlot } from '../utils/months'

export type MonthlyHoursState = Record<number, Record<string, number>>

interface CapacityLimitView {
	userName: string
	monthKey: string
	maxHours: number
	usedHours: number
	availableHours: number
}

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
	potencialProjectId = null,
}) => {
	const [capacityLimits, setCapacityLimits] = useState<CapacityLimitView[]>([])
	const [loadingLimits, setLoadingLimits] = useState<boolean>(false)
	const [capacityError, setCapacityError] = useState<string | null>(null)

	const monthKeys = useMemo(() => months.map((m) => m.key), [months])

	useEffect(() => {
		if (selectedUsers.length === 0 || monthKeys.length === 0) {
			setCapacityLimits([])
			return
		}

		let cancelled = false

		void (async () => {
			setLoadingLimits(true)
			setCapacityError(null)

			try {
				const response = await capacityAdapter.getCapacityLimits({
					userNames: selectedUsers.map((u) => u.FullName),
					monthKeys,
					potencialProjectId,
				})

				if (cancelled) return

				setCapacityLimits(response.limits)
			} catch (error: unknown) {
				const err = error instanceof Error ? error : new Error('Unknown error loading capacity limits')
				logger.errorTag(LogTag.Adapter, err)

				if (!cancelled) {
					setCapacityError(err.message)
				}
			} finally {
				if (!cancelled) {
					setLoadingLimits(false)
				}
			}
		})()

		return () => {
			cancelled = true
		}
	}, [selectedUsers, monthKeys, potencialProjectId])

	const getLimit = (userName: string, monthKey: string): CapacityLimitView | null => {
		return capacityLimits.find((l) => l.userName === userName && l.monthKey === monthKey) ?? null
	}

	const getCellClassName = (user: UserRefDto, monthKey: string, value: number): string => {
		const limit = getLimit(user.FullName, monthKey)

		if (!limit || value <= 0) {
			return 'estimated-project-monthly-grid__input'
		}

		if (value > limit.availableHours) {
			return 'estimated-project-monthly-grid__input estimated-project-monthly-grid__input--error'
		}

		return 'estimated-project-monthly-grid__input estimated-project-monthly-grid__input--ok'
	}

	const getUserTotal = (userId: number): number => {
		const bucket = values[userId] ?? {}

		return Object.values(bucket).reduce((acc, current) => acc + current, 0)
	}

	const getMonthTotal = (monthKey: string): number => {
		return selectedUsers.reduce((acc, user) => {
			return acc + (values[user.Id]?.[monthKey] ?? 0)
		}, 0)
	}

	const grandTotal = useMemo(() => {
		return selectedUsers.reduce((acc, user) => acc + getUserTotal(user.Id), 0)
	}, [selectedUsers, values])

	if (selectedUsers.length === 0) {
		return (
			<section className="estimated-project-monthly-grid">
				<div className="estimated-project-monthly-grid__empty">Seleccioná al menos un recurso para cargar horas mensuales.</div>
			</section>
		)
	}

	return (
		<section className="estimated-project-monthly-grid">
			<div className="estimated-project-monthly-grid__header">
				<div>
					<h3 className="estimated-project-monthly-grid__title">Carga mensual de horas</h3>
					<p className="estimated-project-monthly-grid__description">Asigná las horas estimadas por recurso y por mes.</p>
				</div>

				<div className="estimated-project-monthly-grid__controls">
					<label className="estimated-project-monthly-grid__label">Meses visibles</label>

					<select className="estimated-project-monthly-grid__select" value={monthCount} onChange={(e) => onMonthCountChange(Number(e.target.value))}>
						<option value={3}>3 meses</option>
						<option value={6}>6 meses</option>
						<option value={9}>9 meses</option>
						<option value={12}>12 meses</option>
					</select>
				</div>
			</div>

			{loadingLimits && <div className="estimated-project-monthly-grid__notice">Calculando disponibilidad...</div>}

			{capacityError && <div className="estimated-project-monthly-grid__error">{capacityError}</div>}

			<div className="estimated-project-monthly-grid__wrapper">
				<table className="estimated-project-monthly-grid__table">
					<thead>
						<tr>
							<th>Recurso</th>

							{months.map((month) => (
								<th key={month.key}>{month.label}</th>
							))}

							<th>Total</th>
						</tr>
					</thead>

					<tbody>
						{selectedUsers.map((user) => (
							<tr key={user.Id}>
								<td className="estimated-project-monthly-grid__user">{user.FullName}</td>

								{months.map((month) => {
									const value = values[user.Id]?.[month.key] ?? 0
									const limit = getLimit(user.FullName, month.key)

									return (
										<td key={`${user.Id}-${month.key}`}>
											<input
												type="number"
												min={0}
												step={1}
												className={getCellClassName(user, month.key, value)}
												value={value === 0 ? '' : value}
												onChange={(e) => onChange(user.Id, month.key, Number(e.target.value))}
											/>

											{limit && <span className="estimated-project-monthly-grid__capacity">Disp. {limit.availableHours} hs</span>}
										</td>
									)
								})}

								<td className="estimated-project-monthly-grid__total">{getUserTotal(user.Id)}</td>
							</tr>
						))}
					</tbody>

					<tfoot>
						<tr>
							<td>Total mes</td>

							{months.map((month) => (
								<td key={`total-${month.key}`}>{getMonthTotal(month.key)}</td>
							))}

							<td>{grandTotal}</td>
						</tr>
					</tfoot>
				</table>
			</div>
		</section>
	)
}
