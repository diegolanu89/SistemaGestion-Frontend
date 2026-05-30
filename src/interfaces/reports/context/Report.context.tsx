// context/Reports.Context.tsx

import { PropsWithChildren, useMemo, useState } from 'react'

import { SectionLoader } from '../../base/components/loading/SectionLoader'

import { reportsContext } from '../hooks/useReport.h'

import { IReportsContext, ExportType } from '../models/IReportContext.m'

export const ReportsProvider = ({ children }: PropsWithChildren) => {
	const [loading, setLoading] = useState(false)

	const [isExportModalOpen, setIsExportModalOpen] = useState(false)

	const [exportType, setExportType] = useState<ExportType | null>(null)

	const [selectedFromDate, setSelectedFromDate] = useState('')

	const [selectedToDate, setSelectedToDate] = useState('')

	const value = useMemo<IReportsContext>(
		() => ({
			loading,

			setLoading,

			isExportModalOpen,

			setIsExportModalOpen,

			exportType,

			setExportType,

			selectedFromDate,

			setSelectedFromDate,

			selectedToDate,

			setSelectedToDate,
		}),
		[loading, isExportModalOpen, exportType, selectedFromDate, selectedToDate]
	)

	return (
		<reportsContext.Provider value={value}>
			{children}

			{loading && <SectionLoader text="Procesando reportes..." />}
		</reportsContext.Provider>
	)
}
