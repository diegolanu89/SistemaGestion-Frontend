import { useCallback, useMemo, useState } from 'react'

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'

import { DotationPreviewDto } from '../models/DotacionPreviewDTO.m'
import { DotationSummaryDto } from '../models/DotacionSummaryDTO.m'

import { DotationDataController } from '../controllers/DotacionDataController.c'

const dotationDataController = new DotationDataController()

export const useDotationReportController = () => {
	const [loading, setLoading] = useState(false)

	const [preview, setPreview] = useState<DotationPreviewDto | null>(null)

	const generatePreview = useCallback(async (monthKeys: string[]) => {
		try {
			setLoading(true)

			logger.infoTag(LogTag.View, `[DOTATION_REPORT] Generating preview (${monthKeys.join(', ')})`)

			const response = await dotationDataController.buildPreview(monthKeys)

			setPreview(response)

			logger.infoTag(LogTag.View, `[DOTATION_REPORT] Preview generated (${response.rows.length} rows)`)
		} catch (error: unknown) {
			logger.errorTag(LogTag.View, error instanceof Error ? error.message : String(error))
		} finally {
			setLoading(false)
		}
	}, [])

	const summary = useMemo<DotationSummaryDto | null>(() => {
		if (!preview) {
			return null
		}

		const users = preview.rows.length

		const projects = new Set(preview.rows.flatMap((row) => row.projects)).size

		const clients = new Set(preview.rows.flatMap((row) => row.clients)).size

		const totalHours = preview.rows.reduce((acc, row) => acc + row.totalHours, 0)

		const availability = preview.rows.reduce((acc, row) => acc + row.capacity, 0)

		const need = preview.rows.reduce((acc, row) => acc + row.forecastEtc, 0)

		const difference = preview.rows.reduce((acc, row) => acc + row.futureDifference, 0)

		return {
			users,

			projects,

			clients,

			totalHours,

			availability,

			need,

			difference,

			fte: availability > 0 ? Number((difference / 160).toFixed(2)) : 0,
		}
	}, [preview])

	return {
		loading,

		preview,

		reportData: preview?.dashboard ?? null,

		summary,

		generatePreview,
	}
}
