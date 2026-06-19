import { FC } from 'react'

interface Props {
	hours: number
	expected: number
	status: 'success' | 'danger' | 'empty'
}

export const DashboardHoursIndicatorTooltip: FC<Props> = ({ hours, expected, status }) => {
	const difference = hours - expected

	const percentage = expected > 0 ? (hours / expected) * 100 : 0

	const getStatusLabel = () => {
		switch (status) {
			case 'success':
				return 'Capacidad cumplida'

			case 'danger':
				return difference > 0 ? 'Sobrecarga detectada' : 'Capacidad incompleta'

			default:
				return 'Sin planificación'
		}
	}

	return (
		<div className="dashboard-hours-tooltip">
			<div className="dashboard-hours-tooltip__header">
				<span className={`dashboard-hours-tooltip__status dashboard-hours-tooltip__status--${status}`} />

				<div className="dashboard-hours-tooltip__title">
					<strong>{getStatusLabel()}</strong>

					<small>{percentage.toFixed(0)}% de utilización</small>
				</div>
			</div>

			<div className="dashboard-hours-tooltip__body">
				<div className="dashboard-hours-tooltip__row">
					<span>Horas cargadas</span>

					<strong>{hours.toFixed(1)}h</strong>
				</div>

				<div className="dashboard-hours-tooltip__row">
					<span>Capacidad esperada</span>

					<strong>{expected.toFixed(1)}h</strong>
				</div>

				<div className="dashboard-hours-tooltip__row">
					<span>Diferencia</span>

					<strong className={difference === 0 ? '' : difference > 0 ? 'dashboard-hours-tooltip__positive' : 'dashboard-hours-tooltip__negative'}>
						{difference > 0 ? '+' : ''}
						{difference.toFixed(1)}h
					</strong>
				</div>
			</div>
		</div>
	)
}
