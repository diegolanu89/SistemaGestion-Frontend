// components/DashboardHoursFilters.tsx

import { ChangeEvent, FC, useEffect, useMemo, useState } from 'react'

import { useDashboardHoursContext } from '../hooks/useEstimatedProjectContext.h'
import { ClearFiltersButton } from '../../base/components/ClearFiltersButton/ClearFiltersButton'

import { DashboardHoursSourceType } from '../model/DashboardHoursDTO.m'

// ==========================
// 🔹 PERIOD HELPERS
// ==========================

const MONTHS_ES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

const getCurrentMonthKey = (): string => {
	const now = new Date()
	return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

const shiftMonth = (key: string, n: number): string => {
	const [y, m] = key.split('-').map(Number)
	const d = new Date(y, m - 1 + n, 1)
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

const generate12Months = (startKey: string): string[] =>
	Array.from({ length: 12 }, (_, i) => shiftMonth(startKey, i))

const formatPeriodLabel = (startKey: string): string => {
	const endKey = shiftMonth(startKey, 11)
	const [sy, sm] = startKey.split('-').map(Number)
	const [ey, em] = endKey.split('-').map(Number)
	return `${MONTHS_ES[sm - 1]} ${sy} – ${MONTHS_ES[em - 1]} ${ey}`
}

// ==========================
// 🔹 COMPONENT
// ==========================

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
	// 🔹 PERIOD STATE
	// ==========================

	const [periodMode, setPeriodMode] = useState<'year' | 'month'>('year')
	const [periodStart, setPeriodStart] = useState(getCurrentMonthKey())

	// Sync local state when filters change externally (clearFilters, applySavedFilter)
	useEffect(() => {
		const keys = filters.month_keys ?? []
		if (keys.length === 12) {
			setPeriodMode('year')
			setPeriodStart(keys[0])
		} else if (keys.length === 1) {
			setPeriodMode('month')
		} else if (keys.length === 0) {
			setPeriodMode('year')
			setPeriodStart(getCurrentMonthKey())
		}
	}, [filters.month_keys])

	const handlePrev = () => {
		const newStart = shiftMonth(periodStart, -12)
		setPeriodStart(newStart)
		setPeriodMode('year')
		setMonthKeys(generate12Months(newStart))
	}

	const handleNext = () => {
		const newStart = shiftMonth(periodStart, 12)
		setPeriodStart(newStart)
		setPeriodMode('year')
		setMonthKeys(generate12Months(newStart))
	}

	const handleSwitchToYear = () => {
		setPeriodMode('year')
		setMonthKeys(generate12Months(periodStart))
	}

	const handleSwitchToMonth = () => {
		setPeriodMode('month')
		const current = filters.month_keys?.length === 1 ? filters.month_keys[0] : periodStart
		setMonthKeys([current])
	}

	const handleMonthSelect = (e: ChangeEvent<HTMLSelectElement>) => {
		const value = e.target.value
		if (value) {
			setMonthKeys([value])
		} else {
			setPeriodMode('year')
			setMonthKeys(generate12Months(periodStart))
		}
	}

	const selectedMonthKey = periodMode === 'month' ? (filters.month_keys?.[0] ?? '') : ''

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

	const sourceOptions = useMemo(() => {
		return (
			dashboard?.options?.source_types ?? [
				{ value: 'ALL', label: 'Todos' },
				{ value: 'ETC', label: 'Solo ETC' },
				{ value: 'POTENTIAL', label: 'Solo Potenciales' },
				{ value: 'TIME_ENTRIES', label: 'Horas Reales' },
			]
		)
	}, [dashboard])

	const hasActiveFilters = Boolean(
		filters.leader_id ||
		filters.project_id ||
		periodMode === 'month' ||
		(filters.source_type && filters.source_type !== 'ALL'),
	)

	// ==========================
	// 🔹 RENDER
	// ==========================

	return (
		<div className="dashboard-hours-filters">
			{/* ========================= */}
			{/* 🔹 PERÍODO */}
			{/* ========================= */}

			<div className="dashboard-hours-filters__field">
				<div className="dashboard-hours-filters__period-label-row">
					<label className="dashboard-hours-filters__label">Período</label>

					<div className="dashboard-hours-filters__period-modes">
						<button
							type="button"
							className={`dashboard-hours-filters__period-mode ${periodMode === 'year' ? 'is-active' : ''}`}
							onClick={handleSwitchToYear}
							data-tooltip="Vista anual (12 meses)"
						>
							Año
						</button>

						<button
							type="button"
							className={`dashboard-hours-filters__period-mode ${periodMode === 'month' ? 'is-active' : ''}`}
							onClick={handleSwitchToMonth}
							data-tooltip="Vista mensual"
						>
							Mes
						</button>
					</div>
				</div>

				{periodMode === 'year' ? (
					<div className="dashboard-hours-filters__period-nav">
						<button type="button" className="dashboard-hours-filters__period-btn" onClick={handlePrev} data-tooltip="Año anterior">
							<span className="material-icons">chevron_left</span>
						</button>

						<span className="dashboard-hours-filters__period-range">{formatPeriodLabel(periodStart)}</span>

						<button type="button" className="dashboard-hours-filters__period-btn" onClick={handleNext} data-tooltip="Año siguiente">
							<span className="material-icons">chevron_right</span>
						</button>
					</div>
				) : (
					<select className="dashboard-hours-filters__select" value={selectedMonthKey} onChange={handleMonthSelect}>
						<option value="">Todos</option>

						{monthOptions.map((month) => (
							<option key={month.month_key} value={month.month_key}>
								{month.month_label ?? month.month_key}
							</option>
						))}
					</select>
				)}
			</div>

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
