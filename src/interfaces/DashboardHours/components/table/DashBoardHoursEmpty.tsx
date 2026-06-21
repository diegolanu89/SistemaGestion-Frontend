import { FC } from 'react'

export const DashboardHoursEmpty: FC = () => {
	return (
		<div className="dashboard-hours-table__empty">
			<div className="dashboard-hours-table__empty-icon">
				<span className="material-icons">analytics</span>
			</div>

			<h3>No hay datos para mostrar</h3>

			<p>Aplicá filtros diferentes o cargá información para visualizar el dashboard.</p>
		</div>
	)
}
