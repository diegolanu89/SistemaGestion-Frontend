import { Status, Category, Type } from './IProyectItem.m'
import { ProjectIntakeRecordDto } from './ProyectDTO.m'
import { ProyectRefs } from './ProyectRefs.m'

export interface IProyectContext {
	search: string
	status: Status | 'all'
	category: Category | 'all'
	type: Type | 'all'

	setSearch: (value: string) => void
	setStatus: (value: Status | 'all') => void
	setCategory: (value: Category | 'all') => void
	setType: (value: Type | 'all') => void

	filtered: ProjectIntakeRecordDto[]

	refs: ProyectRefs | null // 🔥 NUEVO

	loading: boolean
	refetch: () => Promise<void>
}
