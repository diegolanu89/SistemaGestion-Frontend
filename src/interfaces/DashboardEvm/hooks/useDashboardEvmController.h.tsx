/* eslint-disable react-hooks/exhaustive-deps */

import { useCallback, useEffect, useMemo, useRef } from 'react'

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'

import { useDashboardEvmContext } from './useDashboardEvmContext.h'
import { dashboardEvmService } from '../services/DashboardEvmBDT.s'
import { DashboardEvmRowDto } from '../models/DashboardEvmDTO.m'
import { ProjectMetricsDto } from '../models/ProjectMetricsDTO.m'
import { groupByClient, ClientGroup } from '../utils/groupByClient'

/** Métricas EVM normalizadas que consume la UI (derivadas de ProjectMetricsDto). */
export interface EvmMetrics {
	bac: number
	ac: number
	etc: number
	eac: number
	vac: number
	advance: number
	changeControl: number
}

export interface DashboardEvmComputedRow {
	row: DashboardEvmRowDto
	metrics: EvmMetrics
}

export interface DashboardEvmComputedGroup {
	clientName: string
	rows: DashboardEvmComputedRow[]
}

export interface DashboardEvmSummary {
	totalProjects: number
	bacTotal: number
	acTotal: number
	etcTotal: number
	eacTotal: number
	vacTotal: number
}

const metricsToEvm = (m: ProjectMetricsDto, row: DashboardEvmRowDto): EvmMetrics => {
	const bac = m.hours.bac_total_hours
	const ac = m.hours.ac_hours_total
	const advance = bac > 0 ? Math.round((ac / bac) * 100) : 0
	const changeControl = m.hours.bac_total_hours - m.hours.bac_base_hours

	return {
		bac,
		ac,
		etc: m.hours.etc_hours,
		eac: m.hours.eac_hours,
		vac: m.hours.vac_hours,
		advance,
		changeControl: Number.isFinite(changeControl) ? changeControl : row.bacTotalHours - row.bacBaseHours,
	}
}

export const useDashboardEvmController = () => {
	const { rows, setRows, loading, setLoading, error, setError, filters, setFilters, setRefetch } = useDashboardEvmContext()

	const inFlightRef = useRef(false)
	const didFetchRef = useRef(false)
	const metricsCacheRef = useRef<Map<number, ProjectMetricsDto>>(new Map())

	const fetchRows = useCallback(async () => {
		if (inFlightRef.current) {
			logger.infoTag(LogTag.Adapter, '[DASHBOARD_EVM] Skipped (in flight)')
			return
		}

		inFlightRef.current = true

		try {
			setLoading(true)
			setError(null)

			logger.infoTag(LogTag.Adapter, '[DASHBOARD_EVM] Fetch start')

			// 1) Lista base de proyectos del dashboard
			const res = await dashboardEvmService.getEvm()
			const baseRows = res.data

			if (baseRows.length === 0) {
				setRows([])
				return
			}

			// 2) En paralelo: métricas EVM reales (batch) + change requests + tracking por proyecto.
			// - change requests determinan el número de "Control de cambios"
			// - tracking determina si la "S" del chip queda azul (tiene) o gris (no tiene)
			// Es N+1 hasta que el back lo incluya en /projects/evm o /metrics/batch.
			const ids = baseRows.map((r) => r.id)

			const [metricsResult, crResults, trackingResults] = await Promise.all([
				dashboardEvmService.getMetricsBatch(ids).catch((e) => {
					logger.errorTag(LogTag.Adapter, '[DASHBOARD_EVM] Metrics batch error', e)
					return [] as ProjectMetricsDto[]
				}),
				Promise.allSettled(ids.map((id) => dashboardEvmService.getChangeRequests(id))),
				Promise.allSettled(ids.map((id) => dashboardEvmService.getTracking(id))),
			])

			const metricsById = new Map<number, ProjectMetricsDto>()
			metricsResult.forEach((m) => metricsById.set(m.project_id, m))
			metricsCacheRef.current = metricsById

			const changesById = new Map<number, number>()
			crResults.forEach((result, idx) => {
				const projectId = ids[idx]
				if (result.status === 'fulfilled') {
					changesById.set(projectId, result.value.length)
				} else {
					logger.warnTag(LogTag.Adapter, '[DASHBOARD_EVM] Change requests error', { projectId, reason: result.reason })
					changesById.set(projectId, 0)
				}
			})

			const trackingById = new Map<number, boolean>()
			trackingResults.forEach((result, idx) => {
				const projectId = ids[idx]
				if (result.status === 'fulfilled') {
					trackingById.set(projectId, result.value !== null)
				} else {
					logger.warnTag(LogTag.Adapter, '[DASHBOARD_EVM] Tracking error', { projectId, reason: result.reason })
					trackingById.set(projectId, false)
				}
			})

			// 3) Merge: cada row queda con changesCount + hasTracking
			const enriched: DashboardEvmRowDto[] = baseRows.map((row) => ({
				...row,
				changesCount: changesById.get(row.id) ?? 0,
				hasTracking: trackingById.get(row.id) ?? false,
			}))

			logger.infoTag(LogTag.Adapter, '[DASHBOARD_EVM] Fetch success', {
				count: enriched.length,
				withMetrics: metricsById.size,
				withChanges: Array.from(changesById.values()).filter((n) => n > 0).length,
				withTracking: Array.from(trackingById.values()).filter(Boolean).length,
			})

			setRows(enriched)
		} catch (e) {
			logger.errorTag(LogTag.Adapter, '[DASHBOARD_EVM] Fetch error', e)
			setError('Error al cargar el dashboard EVM')
		} finally {
			setLoading(false)
			inFlightRef.current = false
		}
	}, [])

	useEffect(() => {
		setRefetch(() => async () => {
			await fetchRows()
		})
	}, [fetchRows])

	useEffect(() => {
		if (didFetchRef.current) return
		didFetchRef.current = true

		logger.infoTag(LogTag.Adapter, '[DASHBOARD_EVM] Initial fetch')
		fetchRows()
	}, [fetchRows])

	const computeMetrics = useCallback((row: DashboardEvmRowDto): EvmMetrics => {
		const m = metricsCacheRef.current.get(row.id)
		if (m) return metricsToEvm(m, row)

		return {
			bac: row.bacTotalHours,
			ac: 0,
			etc: row.etcTotalHours,
			eac: row.etcTotalHours,
			vac: row.bacTotalHours - row.etcTotalHours,
			advance: 0,
			changeControl: row.bacTotalHours - row.bacBaseHours,
		}
	}, [])

	const filtered: DashboardEvmComputedRow[] = useMemo(() => {
		const clientQ = filters.client.trim().toLowerCase()
		const projectQ = filters.project.trim().toLowerCase()
		const vacMin = filters.vacMin === '' ? null : Number(filters.vacMin)
		const vacMax = filters.vacMax === '' ? null : Number(filters.vacMax)

		return rows
			.filter((row) => {
				if (clientQ && !(row.clientName ?? '').toLowerCase().includes(clientQ)) return false
				if (projectQ) {
					const haystack = `${row.code ?? ''} ${row.name}`.toLowerCase()
					if (!haystack.includes(projectQ)) return false
				}
				return true
			})
			.map((row) => ({ row, metrics: computeMetrics(row) }))
			.filter(({ metrics }) => {
				if (vacMin !== null && !Number.isNaN(vacMin) && metrics.vac < vacMin) return false
				if (vacMax !== null && !Number.isNaN(vacMax) && metrics.vac > vacMax) return false
				return true
			})
	}, [rows, filters, computeMetrics])

	const groups: DashboardEvmComputedGroup[] = useMemo(() => {
		const grouped: ClientGroup[] = groupByClient(filtered.map(({ row }) => row))

		return grouped.map(({ clientName, rows: groupRows }) => ({
			clientName,
			rows: groupRows.map((row) => ({ row, metrics: computeMetrics(row) })),
		}))
	}, [filtered, computeMetrics])

	const summary: DashboardEvmSummary = useMemo(() => {
		const totals = filtered.reduce(
			(acc, { metrics }) => {
				acc.bac += metrics.bac
				acc.ac += metrics.ac
				acc.etc += metrics.etc
				acc.eac += metrics.eac
				acc.vac += metrics.vac
				return acc
			},
			{ bac: 0, ac: 0, etc: 0, eac: 0, vac: 0 }
		)

		return {
			totalProjects: filtered.length,
			bacTotal: totals.bac,
			acTotal: totals.ac,
			etcTotal: totals.etc,
			eacTotal: totals.eac,
			vacTotal: totals.vac,
		}
	}, [filtered])

	return {
		loading,
		error,
		filters,
		setFilters,
		groups,
		summary,
		refetch: fetchRows,
	}
}
