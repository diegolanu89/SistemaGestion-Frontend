import { FC, useMemo, useState } from 'react'

import { useEtcWeeklyVersionController } from '../hooks/useEtcWeelyVersionController.h'

export const EtcWeeklyVersionMonthSelector: FC = () => {
	const {
		selectedMonths,
		rangeLabel,

		addMonth,
		addMultipleMonths,

		removeMonth,
		clearMonths,

		monthToAdd,
		setMonthToAdd,
	} = useEtcWeeklyVersionController()

	const [pendingMonths, setPendingMonths] = useState<string[]>([])

	const months = useMemo(() => {
		const result: {
			value: string
			label: string
		}[] = []

		const today = new Date()

		for (let i = 0; i < 18; i++) {
			const current = new Date(today.getFullYear(), today.getMonth() + i)

			const value = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`

			const label = current.toLocaleDateString('es-AR', {
				month: 'short',
				year: '2-digit',
			})

			result.push({
				value,
				label: label.replace('.', '').toUpperCase(),
			})
		}

		return result
	}, [])

	const monthAlreadyAdded = Boolean(monthToAdd && selectedMonths.includes(monthToAdd))

	const togglePendingMonth = (month: string) => {
		if (selectedMonths.includes(month)) {
			return
		}

		setPendingMonths((prev) => {
			if (prev.includes(month)) {
				return prev.filter((m) => m !== month)
			}

			return [...prev, month]
		})
	}

	const handleAddPendingMonths = () => {
		if (pendingMonths.length === 0) {
			return
		}

		addMultipleMonths(pendingMonths)

		setPendingMonths([])
	}

	const handlePreset = (count: number) => {
		const presetMonths = months.slice(0, count).map((m) => m.value)

		addMultipleMonths(presetMonths)
	}

	return (
		<section className="etc-weekly-months">
			<div className="etc-weekly-months__header">
				<div className="etc-weekly-months__title-group">
					<h3>Horizonte de planificación</h3>

					<div className="etc-weekly-months__range">
						<span className="material-icons">calendar_month</span>

						<span>{rangeLabel || 'Sin meses seleccionados'}</span>
					</div>
				</div>

				<div className="etc-weekly-months__quick-actions">
					<button type="button" onClick={() => handlePreset(3)}>
						+3M
					</button>

					<button type="button" onClick={() => handlePreset(6)}>
						+6M
					</button>

					<button type="button" onClick={() => handlePreset(12)}>
						+12M
					</button>

					<button type="button" className="etc-weekly-months__clear" onClick={clearMonths} disabled={selectedMonths.length === 0}>
						<span className="material-icons">clear_all</span>
						Limpiar
					</button>
				</div>
			</div>

			<div className="etc-weekly-months__timeline">
				{months.map((month) => {
					const added = selectedMonths.includes(month.value)

					const pending = pendingMonths.includes(month.value)

					const current = monthToAdd === month.value

					return (
						<button
							key={month.value}
							type="button"
							className={`
								etc-weekly-months__month
								${added ? 'is-added' : ''}
								${pending ? 'is-pending' : ''}
								${current ? 'is-selected' : ''}
							`}
							onClick={() => {
								if (added) {
									return
								}

								togglePendingMonth(month.value)
							}}
						>
							<span>{month.label}</span>

							{added && <span className="material-icons">check_circle</span>}

							{!added && pending && <span className="material-icons">add_circle</span>}
						</button>
					)
				})}
			</div>

			{pendingMonths.length > 0 && (
				<div className="etc-weekly-months__actions">
					<button type="button" className="etc-weekly-months__add" onClick={handleAddPendingMonths}>
						<span className="material-icons">queue</span>
						Agregar {pendingMonths.length} {pendingMonths.length === 1 ? 'mes' : 'meses'}
					</button>
				</div>
			)}

			<div className="etc-weekly-months__actions">
				<input type="month" value={monthToAdd} onChange={(e) => setMonthToAdd(e.target.value)} className="etc-weekly-months__picker" />

				<button type="button" className="etc-weekly-months__add" onClick={addMonth} disabled={monthAlreadyAdded}>
					<span className="material-icons">add</span>
					Agregar mes
				</button>
			</div>

			{monthAlreadyAdded && (
				<div className="etc-weekly-months__warning">
					<span className="material-icons">info</span>
					Este mes ya forma parte del horizonte seleccionado.
				</div>
			)}

			<div className="etc-weekly-months__chips">
				<div className="etc-weekly-months__chips-header">
					<span className="material-icons">event</span>

					<span>{selectedMonths.length} meses seleccionados</span>
				</div>

				{selectedMonths.map((month) => (
					<div key={month} className="etc-weekly-months__chip">
						<span className="material-icons">calendar_month</span>

						<span>{month}</span>

						<button type="button" onClick={() => removeMonth(month)}>
							<span className="material-icons">close</span>
						</button>
					</div>
				))}
			</div>
		</section>
	)
}
