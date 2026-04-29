import { Status, Category, Type } from './IProyectItem.m'
import { ProjectIntakeRecordDto } from './ProyectDTO.m'
import { ProyectRefs } from './ProyectRefs.m'

export type CreateStatus = 'idle' | 'loading' | 'success' | 'error'

export interface IProyectContext {
	// ==========================
	// 🔹 FILTER STATE
	// ==========================
	search: string
	status: Status | 'all'
	category: Category | 'all'
	type: Type | 'all'

	setSearch: (value: string) => void
	setStatus: (value: Status | 'all') => void
	setCategory: (value: Category | 'all') => void
	setType: (value: Type | 'all') => void

	// ==========================
	// 🔹 DATA
	// ==========================
	filtered: ProjectIntakeRecordDto[]

	refs: ProyectRefs | null

	loading: boolean
	refetch: () => Promise<void>

	// ==========================
	// 🔹 CREATE MODAL
	// ==========================
	isCreateOpen: boolean
	openCreate: () => void
	closeCreate: () => void

	// ==========================
	// ✅ CREATE UX GLOBAL STATE
	// ==========================
	createStatus: CreateStatus
	createMessage: string | null
	setCreateStatus: (status: CreateStatus) => void
	setCreateMessage: (message: string | null) => void
}
