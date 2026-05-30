// components/DotationExportModal.tsx

import { FC } from 'react'
import { DotationPreviewDto } from '../models/DotacionPreviewDTO.m'
import { useReports } from '../hooks/useReport.h'

interface Props {
	preview: DotationPreviewDto
}

export const DotationExportModal: FC<Props> = ({ preview }) => {
	const { isExportModalOpen, setIsExportModalOpen } = useReports()

	if (!isExportModalOpen) {
		return null
	}

	const handleClose = (): void => {
		setIsExportModalOpen(false)
	}

	const handleExportExcel = (): void => {
		console.log('Export Excel', preview)

		handleClose()
	}

	const handleExportCsv = (): void => {
		console.log('Export CSV', preview)

		handleClose()
	}

	const handleExportPdf = (): void => {
		console.log('Export PDF', preview)

		handleClose()
	}

	return (
		<div className="dotation-export-modal__backdrop" onClick={handleClose}>
			<div
				className="dotation-export-modal"
				onClick={(event) => {
					event.stopPropagation()
				}}
			>
				<div className="dotation-export-modal__header">
					<h2>Exportar Reporte</h2>

					<button type="button" className="dotation-export-modal__close" onClick={handleClose}>
						<span className="material-icons">close</span>
					</button>
				</div>

				<div className="dotation-export-modal__content">
					<button type="button" className="dotation-export-modal__option is-excel" onClick={handleExportExcel}>
						<span className="material-icons">table_view</span>

						<div>
							<strong>Excel (.xlsx)</strong>

							<span>Exportación completa para análisis</span>
						</div>
					</button>

					<button type="button" className="dotation-export-modal__option is-csv" onClick={handleExportCsv}>
						<span className="material-icons">description</span>

						<div>
							<strong>CSV (.csv)</strong>

							<span>Compatible con Excel y BI</span>
						</div>
					</button>

					<button type="button" className="dotation-export-modal__option is-pdf" onClick={handleExportPdf}>
						<span className="material-icons">picture_as_pdf</span>

						<div>
							<strong>PDF (.pdf)</strong>

							<span>Versión lista para compartir</span>
						</div>
					</button>
				</div>
			</div>
		</div>
	)
}

export default DotationExportModal
