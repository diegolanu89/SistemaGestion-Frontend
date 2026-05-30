import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'

import { DotationPreviewDto } from '../models/DotacionPreviewDTO.m'
import { DotationExcelExporter } from './ExporExcelController.c'
import { DotationCsvExporter } from './ExportCSVController.c'
import { DotationPdfExporter } from './ExportPDFController.c'

export class DotationExportController {
	exportExcel(preview: DotationPreviewDto, fileName: string): void {
		logger.infoTag(LogTag.View, `[DOTATION_EXPORT] Exporting Excel (${preview.rows.length} rows)`)

		try {
			DotationExcelExporter.export(preview, fileName)

			logger.infoTag(LogTag.View, `[DOTATION_EXPORT] Excel exported successfully`)
		} catch (error: unknown) {
			logger.errorTag(LogTag.View, error instanceof Error ? error : new Error(String(error)))
		}
	}

	exportCsv(preview: DotationPreviewDto, fileName: string): void {
		logger.infoTag(LogTag.View, `[DOTATION_EXPORT] Exporting CSV (${preview.rows.length} rows)`)

		try {
			DotationCsvExporter.export(preview, fileName)

			logger.infoTag(LogTag.View, `[DOTATION_EXPORT] CSV exported successfully`)
		} catch (error: unknown) {
			logger.errorTag(LogTag.View, error instanceof Error ? error : new Error(String(error)))
		}
	}

	exportPdf(preview: DotationPreviewDto, fileName: string, fromDate?: string, toDate?: string): void {
		logger.infoTag(LogTag.View, `[DOTATION_EXPORT] Exporting PDF (${preview.rows.length} rows)`)

		try {
			void DotationPdfExporter.export(preview, fileName, fromDate, toDate)

			logger.infoTag(LogTag.View, `[DOTATION_EXPORT] PDF exported successfully`)
		} catch (error: unknown) {
			logger.errorTag(LogTag.View, error instanceof Error ? error : new Error(String(error)))
		}
	}
}

export const dotationExportController = new DotationExportController()
