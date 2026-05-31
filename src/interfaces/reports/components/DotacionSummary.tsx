import { FC } from 'react'

import { DotationSummaryDto } from '../models/DotacionSummaryDTO.m'

interface Props {
	summary: DotationSummaryDto
}

export const DotationSummary: FC<Props> = ({ summary }) => {
	return (
		<div className="dotation-report__summary">
			<div className="dotation-report__metric">
				<span className="material-icons">groups</span>

				<div>
					<strong>{summary.users}</strong>

					<span>Recursos</span>
				</div>
			</div>

			<div className="dotation-report__metric">
				<span className="material-icons">folder</span>

				<div>
					<strong>{summary.projects}</strong>

					<span>Proyectos</span>
				</div>
			</div>

			<div className="dotation-report__metric">
				<span className="material-icons">business</span>

				<div>
					<strong>{summary.clients}</strong>

					<span>Clientes</span>
				</div>
			</div>

			<div className="dotation-report__metric">
				<span className="material-icons">schedule</span>

				<div>
					<strong>{summary.totalHours.toFixed(0)}</strong>

					<span>Horas Planificadas</span>
				</div>
			</div>

			<div className="dotation-report__metric">
				<span className="material-icons">inventory_2</span>

				<div>
					<strong>{summary.availability.toFixed(0)}</strong>

					<span>Capacidad Total</span>
				</div>
			</div>

			<div className="dotation-report__metric">
				<span className="material-icons">insights</span>

				<div>
					<strong>{summary.need.toFixed(0)}</strong>

					<span>Forecast ETC</span>
				</div>
			</div>

			<div className={`dotation-report__metric ${summary.difference >= 0 ? 'is-positive' : 'is-negative'}`}>
				<span className="material-icons">{summary.difference >= 0 ? 'check_circle' : 'warning'}</span>

				<div>
					<strong>{summary.difference.toFixed(0)}</strong>

					<span>Capacidad Disponible</span>
				</div>
			</div>

			<div className="dotation-report__metric">
				<span className="material-icons">person</span>

				<div>
					<strong>{summary.fte}</strong>

					<span>FTE Disponible</span>
				</div>
			</div>
		</div>
	)
}

export default DotationSummary
