// components/EtcWeeklyVersionMetrics.tsx

import { FC } from 'react'

import { useEtcWeeklyVersionController } from '../hooks/useEtcWeelyVersionController.h'

export const EtcWeeklyVersionMetrics: FC = () => {
	const { bac, erc, usePercentage } = useEtcWeeklyVersionController()

	const colorClass = usePercentage >= 85 ? 'is-danger' : usePercentage >= 60 ? 'is-warning' : 'is-success'

	return (
		<section className="etc-weekly-metrics">
			{/* =========================
			    LEFT CARDS
			========================= */}

			<div className="etc-weekly-metrics__cards">
				<div className="etc-weekly-mini-card etc-weekly-mini-card--bac">
					<div className="etc-weekly-mini-card__icon">
						<span className="material-icons">account_balance_wallet</span>
					</div>

					<div className="etc-weekly-mini-card__content">
						<span className="etc-weekly-mini-card__label">BAC</span>

						<strong className="etc-weekly-mini-card__value">{bac.toFixed(2)}h</strong>
					</div>
				</div>

				<div className={`etc-weekly-mini-card etc-weekly-mini-card--erc ${colorClass}`}>
					<div className="etc-weekly-mini-card__icon">
						<span className="material-icons">query_stats</span>
					</div>

					<div className="etc-weekly-mini-card__content">
						<span className="etc-weekly-mini-card__label">ERC / ETC</span>

						<strong className="etc-weekly-mini-card__value">{erc.toFixed(2)}h</strong>
					</div>
				</div>
			</div>

			{/* =========================
			    RIGHT PROGRESS
			========================= */}

			<div className="etc-weekly-progress-card">
				<div className="etc-weekly-progress-card__header">
					<div>
						<h4>Use BAC</h4>

						<p>Porcentaje utilizado del BAC total del proyecto.</p>
					</div>

					<strong>{usePercentage.toFixed(1)}%</strong>
				</div>

				<div className="etc-weekly-progress">
					<div className="etc-weekly-progress__bar">
						<div
							className={`etc-weekly-progress__fill ${colorClass}`}
							style={{
								width: `${Math.min(usePercentage, 100)}%`,
							}}
						/>
					</div>

					<div className="etc-weekly-progress__legend">
						<span>{erc.toFixed(2)}h utilizadas</span>

						<span>{bac.toFixed(2)}h disponibles</span>
					</div>
				</div>
			</div>
		</section>
	)
}
