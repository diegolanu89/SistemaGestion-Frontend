// context/Reports.Context.tsx

import { PropsWithChildren, useMemo, useState } from 'react'

import { SectionLoader } from '../../base/components/loading/SectionLoader'

import { reportsContext } from '../hooks/useReport.h'

import { IReportsContext } from '../models/IReportContext.m'

export const ReportsProvider = ({ children }: PropsWithChildren) => {
	const [loading, setLoading] = useState(false)

	const [isExportModalOpen, setIsExportModalOpen] = useState(false)

	const value = useMemo<IReportsContext>(
		() => ({
			loading,

			setLoading,

			isExportModalOpen,

			setIsExportModalOpen,
		}),
		[loading, isExportModalOpen]
	)

	return (
		<reportsContext.Provider value={value}>
			{children}

			{loading && <SectionLoader text="Procesando reportes..." />}
		</reportsContext.Provider>
	)
}
