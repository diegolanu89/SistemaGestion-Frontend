import { FC, useMemo, useState } from 'react'

import { useDotationReportController } from '../hooks/useDotacionReport.h'
import { useReports } from '../hooks/useReport.h'

import DotationHeader from '../components/DotacionHeader'
import DotationFilters from '../components/DotacionFilters'
import DotationSummary from '../components/DotacionSummary'
import DotationReportTable from '../components/DotationReportTable'
import DotationExportActions from '../components/DotacionExportActions'
import DotationExportModal from '../components/ExportStep/DotacionExportModal'

export const DotationReport: FC = () => {
	const { loading, preview, summary, generatePreview } = useDotationReportController()

	const { setSelectedFromDate, setSelectedToDate } = useReports()

	const [fromDate, setFromDate] = useState('')

	const [toDate, setToDate] = useState('')

	const isValidRange = useMemo(() => {
		if (!fromDate || !toDate) {
			return false
		}

		return new Date(fromDate) <= new Date(toDate)
	}, [fromDate, toDate])

	const buildMonthKeys = (): string[] => {
		if (!isValidRange) {
			return []
		}

		const result: string[] = []

		const start = new Date(fromDate + 'T00:00:00')

		const end = new Date(toDate + 'T00:00:00')

		const current = new Date(start)

		while (current <= end) {
			const year = current.getFullYear()

			const month = String(current.getMonth() + 1).padStart(2, '0')

			result.push(`${year}-${month}`)

			current.setMonth(current.getMonth() + 1)
		}

		return result
	}

	const handleGenerate = async (): Promise<void> => {
		setSelectedFromDate(fromDate)

		setSelectedToDate(toDate)

		await generatePreview(buildMonthKeys())
	}

	return (
		<div className="dotation-report">
			<DotationHeader />

			<DotationFilters
				fromDate={fromDate}
				toDate={toDate}
				loading={loading}
				isValidRange={isValidRange}
				onFromDateChange={setFromDate}
				onToDateChange={setToDate}
				onGenerate={() => void handleGenerate()}
			/>

			{preview && summary && (
				<>
					<DotationSummary summary={summary} />

					<DotationExportActions disabled={loading} />

					<DotationReportTable preview={preview} />

					<DotationExportModal preview={preview} />
				</>
			)}
		</div>
	)
}

export default DotationReport
