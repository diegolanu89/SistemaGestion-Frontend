// components/EtcWeeklyVersionMetrics.tsx

import { FC } from 'react'

interface Props {
	bac: number
	erc: number
	usePercentage: number
}

export const EtcWeeklyVersionMetrics: FC<Props> = ({ bac, erc, usePercentage }) => {
	const colorClass = usePercentage >= 85 ? 'is-danger' : usePercentage >= 60 ? 'is-warning' : 'is-success'

	return (
		<section className="etc-weekly-metrics">
			<div className="etc-weekly-metric-card">
				<span className="etc-weekly-metric-card__label">BAC</span>

				<strong>{bac.toFixed(2)}h</strong>
			</div>

			<div className="etc-weekly-metric-card">
				<span className="etc-weekly-metric-card__label">ERC / ETC</span>

				<strong>{erc.toFixed(2)}h</strong>
			</div>

			<div className="etc-weekly-metric-card etc-weekly-metric-card--wide">
				<div className="etc-weekly-progress">
					<div className="etc-weekly-progress__header">
						<span>Use BAC</span>

						<strong>{usePercentage.toFixed(1)}%</strong>
					</div>

					<div className="etc-weekly-progress__bar">
						<div
							className={`etc-weekly-progress__fill ${colorClass}`}
							style={{
								width: `${Math.min(usePercentage, 100)}%`,
							}}
						/>
					</div>
				</div>
			</div>
		</section>
	)
}
