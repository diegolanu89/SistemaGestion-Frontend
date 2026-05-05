import { Status, Category, Type } from './IProyectItem.m'
import { ProjectIntakeRecordDto } from './ProyectDTO.m'
import { ProyectRefs } from './ProyectRefs.m'

export type CreateStatus = 'idle' | 'loading' | 'success' | 'error'
export type EditStatus = 'idle' | 'loading' | 'success' | 'error'
export type DeleteStatus = 'idle' | 'loading' | 'success' | 'error'

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

	createStatus: CreateStatus
	createMessage: string | null
	setCreateStatus: (status: CreateStatus) => void
	setCreateMessage: (message: string | null) => void

	// ==========================
	// 🔹 EDIT MODAL
	// ==========================
	isEditOpen: boolean
	openEdit: (project: ProjectIntakeRecordDto) => void
	closeEdit: () => void

	selectedProject: ProjectIntakeRecordDto | null

	editStatus: EditStatus
	editMessage: string | null
	setEditStatus: (status: EditStatus) => void
	setEditMessage: (message: string | null) => void

	// ==========================
	// 🔥 DELETE MODAL
	// ==========================
	isDeleteOpen: boolean
	openDelete: (project: ProjectIntakeRecordDto) => void
	closeDelete: () => void

	deleteStatus: DeleteStatus
	deleteMessage: string | null
	setDeleteStatus: (status: DeleteStatus) => void
	setDeleteMessage: (message: string | null) => void
}
