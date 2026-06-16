import { FC, ChangeEvent } from 'react'
import { DashboardEvmFilters as Filters } from '../models/DashboardEvmFilters.m'

interface Props {
	filters: Filters
	onChange: (next: Filters) => void
}

export const DashboardEvmFiltersBar: FC<Props> = ({ filters, onChange }) => {
	const update = (key: keyof Filters) => (e: ChangeEvent<HTMLInputElement>) => {
		onChange({ ...filters, [key]: e.target.value })
	}

	return (
		<section className="dashboard-evm-filters">
			<header className="dashboard-evm-filters__title">
				<span className="material-icons">filter_alt</span>
				<h3>Filtros</h3>
			</header>

			<div className="dashboard-evm-filters__grid">
				<div className="dashboard-evm-filters__field">
					<label>Cliente</label>
					<input type="text" placeholder="Buscar cliente..." value={filters.client} onChange={update('client')} />
				</div>

				<div className="dashboard-evm-filters__field">
					<label>Proyecto</label>
					<input type="text" placeholder="Buscar proyecto..." value={filters.project} onChange={update('project')} />
				</div>

				<div className="dashboard-evm-filters__field">
					<label>VAC Mínimo</label>
					<input type="number" placeholder="Ej: -1000" value={filters.vacMin} onChange={update('vacMin')} />
				</div>

				<div className="dashboard-evm-filters__field">
					<label>VAC Máximo</label>
					<input type="number" placeholder="Ej: 1000" value={filters.vacMax} onChange={update('vacMax')} />
				</div>

				<div className="dashboard-evm-filters__field">
					<label>Inicio desde</label>
					<input type="date" value={filters.dateFrom} onChange={update('dateFrom')} max={filters.dateTo || undefined} />
				</div>

				<div className="dashboard-evm-filters__field">
					<label>Inicio hasta</label>
					<input type="date" value={filters.dateTo} onChange={update('dateTo')} min={filters.dateFrom || undefined} />
				</div>
			</div>
		</section>
	)
}
