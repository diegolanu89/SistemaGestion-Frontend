// components/DashboardHoursTable.tsx

import { FC, Fragment, useMemo, useState } from 'react'

import { useDashboardHoursContext } from '../hooks/useEstimatedProjectContext.h'

import { DashboardHoursDetailDto, DashboardHoursRowDto } from '../model/DashboardHoursDTO.m'

const PAGE_SIZE = 10

type CapacityStatus = 'success' | 'danger' | 'empty'

const getCapacityStatus = (hours: number, max: number): CapacityStatus => {
	if (hours <= 0) return 'empty'

	return hours > max ? 'danger' : 'success'
}

const getRoleClass = (role?: string | null): string => {
	const normalized = role?.toUpperCase() ?? 'NA'

	if (normalized.includes('LD')) return 'is-leader'

	if (normalized.includes('DEV')) return 'is-dev'

	if (normalized.includes('QA')) return 'is-qa'

	if (normalized.includes('AF')) return 'is-af'

	return 'is-default'
}

const getProjectChipClass = (type?: string | null): string => {
	if (type === 'R') return 'dashboard-hours-table__project-chip--real'

	if (type === 'F') return 'dashboard-hours-table__project-chip--forecast'

	return 'dashboard-hours-table__project-chip--default'
}

export const DashboardHoursTable: FC = () => {
	const { dashboard } = useDashboardHoursContext()

	const [expandedUsers, setExpandedUsers] = useState<Record<number, boolean>>({})

	const [page, setPage] = useState<number>(1)

	const rows = useMemo(() => dashboard?.data ?? [], [dashboard])

	const months = useMemo(() => dashboard?.months ?? [], [dashboard])

	const monthHours = useMemo(() => dashboard?.month_hours ?? {}, [dashboard])

	const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))

	const paginatedRows = useMemo(() => {
		const start = (page - 1) * PAGE_SIZE

		return rows.slice(start, start + PAGE_SIZE)
	}, [rows, page])

	const toggleUser = (userId: number) => {
		setExpandedUsers((prev) => ({
			...prev,

			[userId]: !prev[userId],
		}))
	}

	// =====================================================
	// 🔹 MONTH CELL
	// =====================================================

	const renderMonthCell = (
		monthsMap: Record<
			string,
			{
				hours: number
				expected: number
			}
		>,
		monthKey: string,
		expectedHours?: number | null,
		key?: string
	) => {
		const month = monthsMap?.[monthKey]

		const hours = month?.hours ?? 0

		const max = expectedHours ?? 160

		const status = getCapacityStatus(hours, max)

		return (
			<td key={key ?? monthKey} className="dashboard-hours-table__cell dashboard-hours-table__month-cell">
				<div
					className={`dashboard-hours-table__hours ${
						status === 'danger'
							? 'dashboard-hours-table__hours--danger'
							: status === 'success'
								? 'dashboard-hours-table__hours--success'
								: 'dashboard-hours-table__hours--empty'
					}`}
				>
					{hours.toFixed(1)}h
				</div>
			</td>
		)
	}

	// =====================================================
	// 🔹 DETAIL ROW
	// =====================================================

	const renderDetailRow = (userId: number, detail: DashboardHoursDetailDto) => {
		const total = Object.values(detail.months).reduce((acc, current) => acc + current.hours, 0)

		return (
			<tr className="dashboard-hours-table__detail-row" key={`${userId}-${detail.project_id}-${detail.project_name}`}>
				<td className="dashboard-hours-table__cell dashboard-hours-table__user-cell dashboard-hours-table__user-cell--detail">
					<div className="dashboard-hours-table__detail-line" />
				</td>

				<td className="dashboard-hours-table__cell">
					<span className="dashboard-hours-table__secondary-text">{detail.client_name ?? '-'}</span>
				</td>

				<td className="dashboard-hours-table__cell">
					<div className="dashboard-hours-table__project">
						<span className="dashboard-hours-table__project-name">{detail.project_name ?? '-'}</span>

						<span className={`dashboard-hours-table__project-chip ${getProjectChipClass(detail.project_type)}`}>{detail.project_type ?? '-'}</span>
					</div>
				</td>

				{months.map((monthKey) => renderMonthCell(detail.months, monthKey, monthHours?.[monthKey], `${userId}-${detail.project_id}-${monthKey}`))}

				<td className="dashboard-hours-table__cell dashboard-hours-table__total-cell">
					<strong>{total.toFixed(1)}h</strong>
				</td>
			</tr>
		)
	}

	// =====================================================
	// 🔹 MAIN ROW
	// =====================================================

	const renderMainRow = (row: DashboardHoursRowDto) => {
		const total = Object.values(row.months).reduce((acc, current) => acc + current.hours, 0)

		const expanded = expandedUsers[row.user_id]

		const hasDetails = row.details.length > 0

		return (
			<Fragment key={row.user_id}>
				<tr className="dashboard-hours-table__row">
					<td className="dashboard-hours-table__cell dashboard-hours-table__user-cell">
						<button className="dashboard-hours-table__expand" onClick={() => toggleUser(row.user_id)} disabled={!hasDetails}>
							{expanded ? '−' : '+'}
						</button>

						<div className="dashboard-hours-table__user-info">
							<div className="dashboard-hours-table__user-main">
								<span className={`dashboard-hours-table__role ${getRoleClass(row.role_short)}`}>{row.role_short ?? 'N/A'}</span>

								<strong className="dashboard-hours-table__user-name">{row.user_name}</strong>
							</div>

							{row.leader_name && <span className="dashboard-hours-table__leader">Líder asignado: {row.leader_name}</span>}
						</div>
					</td>

					<td className="dashboard-hours-table__cell">
						<span className="dashboard-hours-table__secondary-text">{row.client_name ?? '-'}</span>
					</td>

					<td className="dashboard-hours-table__cell">
						<div className="dashboard-hours-table__project">
							<span className="dashboard-hours-table__project-name">{row.project_name ?? '-'}</span>

							{row.project_type && <span className={`dashboard-hours-table__project-chip ${getProjectChipClass(row.project_type)}`}>{row.project_type}</span>}
						</div>
					</td>

					{months.map((monthKey) => renderMonthCell(row.months, monthKey, monthHours?.[monthKey], `${row.user_id}-${monthKey}`))}

					<td className="dashboard-hours-table__cell dashboard-hours-table__total-cell">
						<strong>{total.toFixed(1)}h</strong>
					</td>
				</tr>

				{expanded && row.details.map((detail) => renderDetailRow(row.user_id, detail))}
			</Fragment>
		)
	}

	// =====================================================
	// 🔹 EMPTY
	// =====================================================

	if (!rows.length) {
		return (
			<div className="dashboard-hours-table__empty">
				<span className="material-icons">monitoring</span>

				<p>No hay datos disponibles para el dashboard.</p>
			</div>
		)
	}

	// =====================================================
	// 🔹 RENDER
	// =====================================================

	return (
		<div className="dashboard-hours-table-card">
			<div className="dashboard-hours-table-card__header">
				<div>
					<h3>Dashboard de Horas</h3>

					<p>Visualización consolidada de capacidad y horas planificadas por usuario.</p>
				</div>

				<span className="dashboard-hours-table-card__count">{rows.length} usuarios</span>
			</div>

			<div className="dashboard-hours-table__wrapper">
				<table className="dashboard-hours-table">
					<thead>
						<tr>
							<th>Usuario</th>

							<th>Cliente</th>

							<th>Proyecto</th>

							{months.map((monthKey) => (
								<th key={monthKey}>
									<div className="dashboard-hours-table__month-header">
										<span>{monthKey}</span>

										<small>{monthHours?.[monthKey] ?? 160}h</small>
									</div>
								</th>
							))}

							<th>Total</th>
						</tr>
					</thead>

					<tbody>{paginatedRows.map(renderMainRow)}</tbody>
				</table>
			</div>

			{totalPages > 1 && (
				<div className="dashboard-hours-table__pagination">
					<button disabled={page <= 1} onClick={() => setPage((prev) => prev - 1)}>
						Anterior
					</button>

					<span>
						Página {page} de {totalPages}
					</span>

					<button disabled={page >= totalPages} onClick={() => setPage((prev) => prev + 1)}>
						Siguiente
					</button>
				</div>
			)}
		</div>
	)
}

export default DashboardHoursTable
