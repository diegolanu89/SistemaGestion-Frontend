import { Dispatch, SetStateAction } from 'react'

export type ExportType = 'excel' | 'csv' | 'pdf'

export interface IReportsContext {
	loading: boolean

	setLoading: Dispatch<SetStateAction<boolean>>

	isExportModalOpen: boolean

	setIsExportModalOpen: Dispatch<SetStateAction<boolean>>

	exportType: ExportType | null

	setExportType: Dispatch<SetStateAction<ExportType | null>>

	selectedFromDate: string
	setSelectedFromDate: Dispatch<SetStateAction<string>>

	selectedToDate: string
	setSelectedToDate: Dispatch<SetStateAction<string>>
}
