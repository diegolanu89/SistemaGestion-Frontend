import { useCallback, useMemo, useState } from 'react'

import { DashBoardHourAdapter } from '../../DashboardHours/services/DashBoardHourAdapter.s'

import { DashboardHoursResponseDto } from '../../DashboardHours/model/DashboardHoursDTO.m'

import logger from '../../base/controllers/Logger.c'

import { LogTag } from '../../base/model/LogTag.m'

export const useDotationReportController = () => {
	const [loading, setLoading] = useState(false)

	const [reportData, setReportData] = useState<DashboardHoursResponseDto | null>(null)

	const generatePreview = useCallback(async (monthKeys: string[]) => {
		try {
			setLoading(true)

			logger.infoTag(LogTag.View, `[DOTATION_REPORT] Generating preview for months: ${monthKeys.join(', ')}`)

			const response = await DashBoardHourAdapter.getDashboard({
				month_keys: monthKeys,
			})

			setReportData(response)

			logger.infoTag(LogTag.View, `[DOTATION_REPORT] Preview generated (${response.data.length} rows)`)
		} catch (error: unknown) {
			logger.errorTag(LogTag.View, error instanceof Error ? error.message : String(error))
		} finally {
			setLoading(false)
		}
	}, [])

	const summary = useMemo(() => {
		if (!reportData) {
			return null
		}

		const users = reportData.data.length

		const projects = new Set(reportData.data.flatMap((row) => row.details?.map((detail) => detail.project_name) ?? [])).size

		const clients = new Set(reportData.data.flatMap((row) => row.details?.map((detail) => detail.client_name) ?? []).filter(Boolean)).size

		let totalHours = 0

		reportData.data.forEach((row) => {
			Object.values(row.months).forEach((month) => {
				totalHours += month.hours
			})
		})

		let availability = 0

		let need = 0

		let difference = 0

		Object.values(reportData.kpis.by_role).forEach((role) => {
			Object.values(role.months).forEach((month) => {
				availability += month.availability

				need += month.need

				difference += month.difference
			})
		})

		const fte = availability > 0 ? Number((difference / 160).toFixed(2)) : 0

		return {
			users,

			projects,

			clients,

			totalHours,

			availability,

			need,

			difference,

			fte,
		}
	}, [reportData])

	return {
		loading,

		reportData,

		summary,

		generatePreview,
	}
}
