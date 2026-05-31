import { FC, useMemo, useState } from 'react'

import { dotationExportController } from '../../controllers/DotacionExportController.c'

import { useReports } from '../../hooks/useReport.h'

import { DotationPreviewDto } from '../../models/DotacionPreviewDTO.m'

import DotationExportConfigurationStep from './DotationExportConfiguration'
import DotationExportTypeStep from './DotationExportTypeStep'

interface Props {
	preview: DotationPreviewDto
}

export const DotationExportModal: FC<Props> = ({ preview }) => {
	const {
		isExportModalOpen,
		setIsExportModalOpen,

		exportType,
		setExportType,

		selectedFromDate,
		selectedToDate,
	} = useReports()

	const [step, setStep] = useState<1 | 2>(1)

	const [fileName, setFileName] = useState('')

	const defaultFileName = useMemo(() => {
		if (selectedFromDate && selectedToDate) {
			return `Dotacion_${selectedFromDate}_${selectedToDate}`
		}

		const today = new Date().toISOString().split('T')[0]

		return `Dotacion_${today}`
	}, [selectedFromDate, selectedToDate])

	if (!isExportModalOpen) {
		return null
	}

	const handleClose = (): void => {
		setIsExportModalOpen(false)

		setExportType(null)

		setStep(1)

		setFileName('')
	}

	const handleSelectType = (type: 'excel' | 'csv' | 'pdf'): void => {
		setExportType(type)

		setFileName(defaultFileName)

		setStep(2)
	}

	const handleExport = (): void => {
		if (!exportType) {
			return
		}

		switch (exportType) {
			case 'excel':
				dotationExportController.exportExcel(preview, fileName)
				break

			case 'csv':
				dotationExportController.exportCsv(preview, fileName)
				break

			case 'pdf':
				dotationExportController.exportPdf(preview, fileName, selectedFromDate, selectedToDate)
				break
		}

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

				{step === 1 && <DotationExportTypeStep onSelect={handleSelectType} />}

				{step === 2 && exportType && (
					<DotationExportConfigurationStep
						fileName={fileName}
						exportType={exportType}
						onFileNameChange={setFileName}
						onBack={() => setStep(1)}
						onExport={handleExport}
					/>
				)}
			</div>
		</div>
	)
}

export default DotationExportModal
