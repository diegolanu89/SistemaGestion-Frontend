// components/EtcWeeklyVersionMonthSelector.tsx

import { FC } from 'react'

import { useEtcWeeklyVersionController } from '../hooks/useEtcWeelyVersionController.h'

export const EtcWeeklyVersionMonthSelector: FC = () => {
	const { selectedMonths, rangeLabel, addMonth, removeMonth, monthToAdd, setMonthToAdd } = useEtcWeeklyVersionController()

	return (
		<section className="etc-weekly-months">
			<div className="etc-weekly-months__header">
				<div className="etc-weekly-months__title-group">
					<h3>Meses incluidos</h3>

					<div className="etc-weekly-months__range">
						<span className="material-icons">calendar_month</span>

						<span>{rangeLabel}</span>
					</div>
				</div>

				<div className="etc-weekly-months__actions">
					<input type="month" value={monthToAdd} onChange={(e) => setMonthToAdd(e.target.value)} className="etc-weekly-months__picker" />

					<button type="button" className="etc-weekly-months__add" onClick={addMonth}>
						<span className="material-icons">add</span>
						Agregar mes
					</button>
				</div>
			</div>

			<div className="etc-weekly-months__chips">
				{selectedMonths.map((month) => (
					<div key={month} className="etc-weekly-months__chip">
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
