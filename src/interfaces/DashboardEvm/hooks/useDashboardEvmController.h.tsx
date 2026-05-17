/* eslint-disable react-hooks/exhaustive-deps */

import { useCallback, useEffect, useMemo, useRef } from 'react'

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'

import { calcAc, calcEac, calcEtc, calcVac, EvmMetrics, calcEvmMetrics } from '../../base/utils/evmCalculations'

import { useDashboardEvmContext } from './useDashboardEvmContext.h'
import { dashboardEvmAdapter } from '../services/DashboardEvmAdapter.s'
import { DashboardEvmRowDto } from '../models/DashboardEvmDTO.m'
import { groupByClient, ClientGroup } from '../utils/groupByClient'

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

export const useDashboardEvmController = () => {
	const {
		rows,
		setRows,
		loading,
		setLoading,
		error,
		setError,
		filters,
		setFilters,
		setRefetch,
	} = useDashboardEvmContext()

	const inFlightRef = useRef(false)
	const didFetchRef = useRef(false)

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

			const res = await dashboardEvmAdapter.getEvm()

			logger.infoTag(LogTag.Adapter, '[DASHBOARD_EVM] Fetch success', {
				count: res.data.length,
				total: res.total,
			})

			setRows(res.data)
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
			.map((row) => ({
				row,
				metrics: calcEvmMetrics(row),
			}))
			.filter(({ metrics }) => {
				if (vacMin !== null && !Number.isNaN(vacMin) && metrics.vac < vacMin) return false
				if (vacMax !== null && !Number.isNaN(vacMax) && metrics.vac > vacMax) return false
				return true
			})
	}, [rows, filters])

	const groups: DashboardEvmComputedGroup[] = useMemo(() => {
		const flatRows = filtered.map(({ row }) => row)
		const grouped: ClientGroup[] = groupByClient(flatRows)

		return grouped.map(({ clientName, rows: groupRows }) => ({
			clientName,
			rows: groupRows.map((row) => ({
				row,
				metrics: calcEvmMetrics(row),
			})),
		}))
	}, [filtered])

	const summary: DashboardEvmSummary = useMemo(() => {
		const totals = filtered.reduce(
			(acc, { row }) => {
				acc.bac += row.bacTotalHours
				acc.ac += calcAc(row)
				acc.etc += calcEtc(row)
				acc.eac += calcEac(row)
				acc.vac += calcVac(row)
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
