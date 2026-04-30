// models/IEstimatedProjectContext.m.ts

import { EstimatedProjectRecordDto } from './EstimatedProjectDTO.m'
import { EstimatedProjectRefs } from './EstimatedProjectRefs.m'

export type CreateStatus = 'idle' | 'loading' | 'success' | 'error'

export interface IEstimatedProjectContext {
	// ==========================
	// 🔹 FILTER STATE
	// ==========================
	search: string
	setSearch: (value: string) => void

	// ==========================
	// 🔹 DATA
	// ==========================
	filtered: EstimatedProjectRecordDto[]
	refs: EstimatedProjectRefs | null

	loading: boolean
	refetch: () => Promise<void>

	// ==========================
	// 🔹 CREATE UX STATE
	// ==========================
	createStatus: CreateStatus
	createMessage: string | null
	setCreateStatus: (status: CreateStatus) => void
	setCreateMessage: (message: string | null) => void
}
