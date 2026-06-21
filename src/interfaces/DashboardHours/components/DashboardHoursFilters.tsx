// components/DashboardHoursFilters.tsx

import { FC, useMemo } from 'react'

import { useDashboardHoursContext } from '../hooks/useEstimatedProjectContext.h'
import { ClearFiltersButton } from '../../base/components/ClearFiltersButton/ClearFiltersButton'

import { DashboardHoursSourceType } from '../model/DashboardHoursDTO.m'

export const DashboardHoursFilters: FC = () => {
	const {
		filters,

		setLeaderId,
		setProjectId,
		setMonthKeys,
		setSourceType,

		clearFilters,
		refetch,

		dashboard,
	} = useDashboardHoursContext()

	// ==========================
	// 🔹 OPTIONS
	// ==========================

	const leaderOptions = useMemo(() => {
		return dashboard?.options?.leaders ?? []
	}, [dashboard])

	const monthOptions = useMemo(() => {
		return dashboard?.options?.months ?? []
	}, [dashboard])

	const projectOptions = useMemo(() => {
		return dashboard?.options?.projects ?? []
	}, [dashboard])

	const hasActiveFilters = Boolean(filters.leader_id || filters.project_id || filters.month_keys?.length || (filters.source_type && filters.source_type !== 'ALL'))

	const sourceOptions = useMemo(() => {
		return (
			dashboard?.options?.source_types ?? [
				{
					value: 'ALL',
					label: 'Todos',
				},
				{
					value: 'ETC',

					label: 'Solo ETC',
				},

				{
					value: 'POTENTIAL',

					label: 'Solo Potenciales',
				},
				{
					value: 'TIME_ENTRIES',
					label: 'Horas Reales',
				},
			]
		)
	}, [dashboard])

	// ==========================
	// 🔹 RENDER
	// ==========================

	return (
		<div className="dashboard-hours-filters">
			{/* ========================= */}
			{/* 🔹 LEADER */}
			{/* ========================= */}

			<div className="dashboard-hours-filters__field" data-tooltip="Filtrar dashboard por líder">
				<label className="dashboard-hours-filters__label">Líder</label>

				<select className="dashboard-hours-filters__select" value={filters.leader_id ?? ''} onChange={(e) => setLeaderId(e.target.value || null)}>
					<option value="">Todos</option>

					{leaderOptions.map((leader) => (
						<option key={leader.id} value={leader.id}>
							{leader.name}
						</option>
					))}
				</select>
			</div>

			{/* ========================= */}
			{/* 🔹 MONTH */}
			{/* ========================= */}

			<div className="dashboard-hours-filters__field" data-tooltip="Filtrar dashboard por mes">
				<label className="dashboard-hours-filters__label">Mes</label>

				<select
					className="dashboard-hours-filters__select"
					value={filters.month_keys?.[0] ?? ''}
					onChange={(e) => {
						const value = e.target.value

						setMonthKeys(value ? [value] : [])
					}}
				>
					<option value="">Todos</option>

					{monthOptions.map((month) => (
						<option key={month.month_key} value={month.month_key}>
							{month.month_label ?? month.month_key}
						</option>
					))}
				</select>
			</div>

			{/* ========================= */}
			{/* 🔹 SOURCE TYPE */}
			{/* ========================= */}

			<div className="dashboard-hours-filters__field" data-tooltip="Origen de las horas">
				<label className="dashboard-hours-filters__label">Origen</label>

				<select
					className="dashboard-hours-filters__select"
					value={filters.source_type ?? 'ALL'}
					onChange={(e) => setSourceType(e.target.value as DashboardHoursSourceType)}
				>
					{sourceOptions.map((source) => (
						<option key={source.value} value={source.value}>
							{source.label}
						</option>
					))}
				</select>
			</div>

			{/* ========================= */}
			{/* 🔹 PROJECT */}
			{/* ========================= */}

			<div className="dashboard-hours-filters__field" data-tooltip="Filtrar dashboard por proyecto">
				<label className="dashboard-hours-filters__label">Proyecto</label>

				<select className="dashboard-hours-filters__select" value={filters.project_id ?? ''} onChange={(e) => setProjectId(e.target.value || null)}>
					<option value="">Todos</option>

					{projectOptions.map((project) => (
						<option key={project.id} value={project.id}>
							{project.name}
						</option>
					))}
				</select>
			</div>

			{/* ========================= */}
			{/* 🔹 ACTIONS */}
			{/* ========================= */}

			<div className="dashboard-hours-filters__refresh">
				<ClearFiltersButton active={hasActiveFilters} onClear={clearFilters} />

				<button className="dashboard-hours-filters__refresh-btn" onClick={refetch} data-tooltip="Actualizar dashboard">
					<span className="material-icons">refresh</span>
				</button>
			</div>
		</div>
	)
}

export default DashboardHoursFilters
