import { FC } from 'react'

type DashboardViewMode = 'details' | 'kpis'

interface Props {
	viewMode: DashboardViewMode

	totalUsers: number

	onChangeViewMode: (mode: DashboardViewMode) => void
}

export const DashboardHoursHeader: FC<Props> = ({ viewMode, totalUsers, onChangeViewMode }) => {
	return (
		<div className="dashboard-hours-table-card__header">
			<div className="dashboard-hours-table-card__header-left">
				<div>
					<h3>Dashboard de Horas</h3>

					<p>Visualización consolidada de capacidad y horas planificadas por usuario.</p>
				</div>

				<div className="dashboard-hours-table-card__view-toggle">
					<button className={`dashboard-hours-table-card__view-btn ${viewMode === 'details' ? 'is-active' : ''}`} onClick={() => onChangeViewMode('details')}>
						<span className="material-icons">groups</span>

						<span>Detalles por usuario</span>
					</button>

					<button className={`dashboard-hours-table-card__view-btn ${viewMode === 'kpis' ? 'is-active' : ''}`} onClick={() => onChangeViewMode('kpis')}>
						<span className="material-icons">monitoring</span>

						<span>KPIs por usuario</span>
					</button>
				</div>
			</div>

			<span className="dashboard-hours-table-card__count">{totalUsers} usuarios</span>
		</div>
	)
}
