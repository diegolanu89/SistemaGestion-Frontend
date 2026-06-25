import { useMemo, useState } from 'react'

import { useDashboardHoursContext } from './useEstimatedProjectContext.h'

const PAGE_SIZE = 10

export type DashboardViewMode = 'details' | 'kpis'

export const useDashboardHoursTable = () => {
	const { dashboard } = useDashboardHoursContext()

	const [expandedUsers, setExpandedUsers] = useState<Record<number, boolean>>({})

	const [page, setPage] = useState(1)

	const [viewMode, setViewMode] = useState<DashboardViewMode>('details')

	// =====================================================
	// DATA
	// =====================================================

	const rows = useMemo(() => dashboard?.data ?? [], [dashboard])

	const months = useMemo(() => dashboard?.months ?? [], [dashboard])

	const monthHours = useMemo<Record<string, number>>(() => {
		const source = dashboard?.month_hours ?? {}

		return Object.entries(source).reduce<Record<string, number>>((acc, [key, value]) => {
			acc[key] = value ?? 0

			return acc
		}, {})
	}, [dashboard])

	// =====================================================
	// PAGINATION
	// =====================================================

	const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))

	const paginatedRows = useMemo(() => {
		const start = (page - 1) * PAGE_SIZE

		return rows.slice(start, start + PAGE_SIZE)
	}, [rows, page])

	// =====================================================
	// EXPAND
	// =====================================================

	const toggleUser = (userId: number) => {
		setExpandedUsers((prev) => ({
			...prev,

			[userId]: !prev[userId],
		}))
	}

	// =====================================================
	// PAGINATION ACTIONS
	// =====================================================

	const nextPage = () => {
		setPage((prev) => Math.min(prev + 1, totalPages))
	}

	const prevPage = () => {
		setPage((prev) => Math.max(prev - 1, 1))
	}

	// =====================================================
	// RETURN
	// =====================================================

	return {
		rows,

		months,

		monthHours,

		page,

		totalPages,

		paginatedRows,

		viewMode,

		setViewMode,

		expandedUsers,

		toggleUser,

		nextPage,

		prevPage,
	}
}
