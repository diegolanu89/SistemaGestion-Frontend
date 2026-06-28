import { FC, useMemo } from 'react'

import { useDashboardEvmContext } from '../hooks/useDashboardEvmContext.h'
import { ClearFiltersButton } from '../../base/components/ClearFiltersButton/ClearFiltersButton'
import { DEFAULT_DASHBOARD_EVM_FILTERS } from '../models/DashboardEvmFilters.m'

export const DashboardEvmFiltersBar: FC = () => {
	const { rows, filters, setFilters } = useDashboardEvmContext()

	const clientOptions = useMemo(() => {
		const values = Array.from(new Set(rows.map((r) => r.clientName).filter(Boolean))) as string[]
		return [{ value: '', label: 'Todos' }, ...values.map((v) => ({ value: v, label: v }))]
	}, [rows])

	const statusOptions = useMemo(() => {
		const values = Array.from(new Set(rows.map((r) => r.status).filter(Boolean)))
		return [{ value: '', label: 'Todos' }, ...values.map((v) => ({ value: v, label: v }))]
	}, [rows])

	const hasActiveFilters = Boolean(
		filters.client || filters.project || filters.status || filters.vacMin || filters.vacMax,
	)

	const update = <K extends keyof typeof filters>(key: K, value: (typeof filters)[K]) => {
		setFilters((prev) => ({ ...prev, [key]: value }))
	}

	return (
		<section className="dashboard-evm-filters">
			{/* ========================= */}
			{/* BUSCAR POR NOMBRE */}
			{/* ========================= */}

			<div className="dashboard-evm-filters__search">
				<label className="dashboard-evm-filters__label">Buscar por nombre</label>

				<div className="dashboard-evm-filters__search-control">
					<span className="material-icons dashboard-evm-filters__search-icon">search</span>

					<input
						className="dashboard-evm-filters__search-input"
						type="text"
						placeholder="Buscar proyecto..."
						value={filters.project}
						onChange={(e) => update('project', e.target.value)}
					/>
				</div>
			</div>

			{/* ========================= */}
			{/* CLIENTE */}
			{/* ========================= */}

			<div className="dashboard-evm-filters__field">
				<label className="dashboard-evm-filters__label">Cliente</label>

				<select className="dashboard-evm-filters__select" value={filters.client} onChange={(e) => update('client', e.target.value)}>
					{clientOptions.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>
			</div>

			{/* ========================= */}
			{/* ESTADO */}
			{/* ========================= */}

			<div className="dashboard-evm-filters__field">
				<label className="dashboard-evm-filters__label">Estado</label>

				<select className="dashboard-evm-filters__select" value={filters.status} onChange={(e) => update('status', e.target.value)}>
					{statusOptions.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>
			</div>

			{/* ========================= */}
			{/* VAC MÍNIMO */}
			{/* ========================= */}

			<div className="dashboard-evm-filters__field">
				<label className="dashboard-evm-filters__label">VAC Mínimo</label>

				<input
					className="dashboard-evm-filters__input"
					type="number"
					placeholder="Ej: -1000"
					value={filters.vacMin}
					onChange={(e) => update('vacMin', e.target.value)}
				/>
			</div>

			{/* ========================= */}
			{/* VAC MÁXIMO */}
			{/* ========================= */}

			<div className="dashboard-evm-filters__field">
				<label className="dashboard-evm-filters__label">VAC Máximo</label>

				<input
					className="dashboard-evm-filters__input"
					type="number"
					placeholder="Ej: 1000"
					value={filters.vacMax}
					onChange={(e) => update('vacMax', e.target.value)}
				/>
			</div>

			{/* ========================= */}
			{/* ACCIONES */}
			{/* ========================= */}

			<div className="dashboard-evm-filters__actions">
				<ClearFiltersButton active={hasActiveFilters} onClear={() => setFilters(DEFAULT_DASHBOARD_EVM_FILTERS)} />
			</div>

		</section>
	)
}
