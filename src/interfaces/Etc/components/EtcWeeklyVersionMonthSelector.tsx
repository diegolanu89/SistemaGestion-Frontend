// components/EtcWeeklyVersionMonthSelector.tsx

import { FC } from 'react'

interface Props {
	months: string[]
	rangeLabel: string
	onAddMonth: () => void
	onRemoveMonth: (month: string) => void
}

export const EtcWeeklyVersionMonthSelector: FC<Props> = ({ months, rangeLabel, onAddMonth, onRemoveMonth }) => {
	return (
		<section className="etc-weekly-months">
			<div className="etc-weekly-months__header">
				<h3>Meses incluidos</h3>

				<button type="button" className="etc-weekly-months__add" onClick={onAddMonth}>
					<span className="material-icons">add</span>
					Agregar mes
				</button>
			</div>

			<div className="etc-weekly-months__chips">
				{months.map((month) => (
					<div key={month} className="etc-weekly-months__chip">
						<span>{month}</span>

						<button type="button" onClick={() => onRemoveMonth(month)}>
							<span className="material-icons">close</span>
						</button>
					</div>
				))}
			</div>

			<div className="etc-weekly-months__range">{rangeLabel}</div>
		</section>
	)
}
