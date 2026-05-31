import { FC, ReactNode } from 'react'

export type MetricCardVariant = 'primary' | 'accent' | 'info' | 'warning' | 'success' | 'secondary' | 'neutral'

interface Props {
	label: string
	value: ReactNode
	unit?: string
	variant?: MetricCardVariant
	tooltip?: string
}

export const MetricCard: FC<Props> = ({ label, value, unit, variant = 'primary', tooltip }) => (
	<div className={`metric-card metric-card--${variant}`} data-tooltip={tooltip}>
		<span className="metric-card__bar" />

		<div className="metric-card__content">
			<span className="metric-card__label">{label}</span>

			<strong className="metric-card__value">{value}</strong>

			{unit && <span className="metric-card__unit">{unit}</span>}
		</div>
	</div>
)

export default MetricCard
