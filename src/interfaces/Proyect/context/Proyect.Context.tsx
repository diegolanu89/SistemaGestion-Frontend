/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useMemo, ReactNode, useState } from 'react'

import { proyectContext } from '../hooks/useProyectContext.h'

import { IProyectContext, CreateStatus, EditStatus, DeleteStatus } from '../models/IProyectContext.m'

import { Category, Status, Type } from '../models/IProyectItem.m'

import { ProjectIntakeRecordDto } from '../models/ProyectDTO.m'

import { useProyectData } from '../hooks/useProyectData.h'

import { useProyectRefs } from '../hooks/useProyectRef.h'

import { PROYECT_CONFIG } from '../models/ProyectConfig.m'

interface IProviderProps {
	children: ReactNode
}

export const ProyectProvider = ({ children }: IProviderProps) => {
	// ==========================
	// CREATE
	// ==========================

	const [isCreateOpen, setIsCreateOpen] = useState(false)

	const [createStatus, setCreateStatus] = useState<CreateStatus>('idle')

	const [createMessage, setCreateMessage] = useState<string | null>(null)

	const openCreate = () => setIsCreateOpen(true)

	const closeCreate = () => setIsCreateOpen(false)

	// ==========================
	// EDIT
	// ==========================

	const [isEditOpen, setIsEditOpen] = useState(false)

	const [selectedProject, setSelectedProject] = useState<ProjectIntakeRecordDto | null>(null)

	const [editStatus, setEditStatus] = useState<EditStatus>('idle')

	const [editMessage, setEditMessage] = useState<string | null>(null)

	const openEdit = (project: ProjectIntakeRecordDto) => {
		setSelectedProject(project)

		setIsEditOpen(true)
	}

	const closeEdit = () => {
		setIsEditOpen(false)

		setSelectedProject(null)
	}

	// ==========================
	// DELETE
	// ==========================

	const [isDeleteOpen, setIsDeleteOpen] = useState(false)

	const [deleteStatus, setDeleteStatus] = useState<DeleteStatus>('idle')

	const [deleteMessage, setDeleteMessage] = useState<string | null>(null)

	const openDelete = (project: ProjectIntakeRecordDto) => {
		setSelectedProject(project)

		setIsDeleteOpen(true)
	}

	const closeDelete = () => {
		setIsDeleteOpen(false)

		setSelectedProject(null)
	}

	// ==========================
	// PAGINATION
	// ==========================

	const [page, setPage] = useState<number>(1)

	const perPage = PROYECT_CONFIG.PAGINATION.PER_PAGE

	// ==========================
	// DATA
	// ==========================

	const {
		data,
		total,
		lastPage,

		loading: loadingData,

		refetch: refetchData,
	} = useProyectData(page, perPage)

	// ==========================
	// REFS
	// ==========================

	const {
		refs,

		loading: loadingRefs,

		refetch: refetchRefs,
	} = useProyectRefs()

	// ==========================
	// FILTERS
	// ==========================

	const [search, setSearch] = useState<string>('')

	const [status, setStatus] = useState<Status | 'all'>('all')

	const [category, setCategory] = useState<Category | 'all'>('all')

	const [type, setType] = useState<Type | 'all'>('all')

	// ==========================
	// FILTERED DATA
	// ==========================

	const filtered = useMemo(() => {
		const searchLower = search.toLowerCase().trim()

		return data.filter((p) => {
			const title = p.ProjectName?.toLowerCase() ?? ''

			const desc = p.Observations?.toLowerCase() ?? ''

			const client = p.ClientName?.toLowerCase() ?? ''

			const matchSearch = title.includes(searchLower) || desc.includes(searchLower) || client.includes(searchLower)

			const matchStatus = status === 'all' || p.ProjectStatusCode === status

			const matchCategory = category === 'all' || p.CategoryCode === category

			const matchType = type === 'all' || p.ProjectType === type

			return matchSearch && matchStatus && matchCategory && matchType
		})
	}, [data, search, status, category, type])

	// ==========================
	// RESET PAGE ON FILTERS
	// ==========================

	useEffect(() => {
		setPage(1)
	}, [search, status, category, type])

	// ==========================
	// PAGINATED
	// ==========================
	// ⚠️ IMPORTANTE:
	// La paginación REAL ya viene del backend.
	// Acá NO hay que hacer slice().
	// ==========================

	const paginated = filtered

	// ==========================
	// LOADING
	// ==========================

	const loading = loadingData || loadingRefs

	// ==========================
	// REFETCH
	// ==========================

	const refetch = async (): Promise<void> => {
		await Promise.all([refetchData(), refetchRefs()])
	}

	// ==========================
	// CONTEXT
	// ==========================

	const contextValue = useMemo<IProyectContext>(
		() => ({
			// filters
			search,
			status,
			category,
			type,

			setSearch,
			setStatus,
			setCategory,
			setType,

			// pagination
			page,
			setPage,

			perPage,

			total,

			lastPage,

			paginated,

			// data
			filtered,

			refs,

			loading,

			refetch,

			// create
			isCreateOpen,
			openCreate,
			closeCreate,

			createStatus,
			createMessage,

			setCreateStatus,
			setCreateMessage,

			// edit
			isEditOpen,
			openEdit,
			closeEdit,

			selectedProject,

			editStatus,
			editMessage,

			setEditStatus,
			setEditMessage,

			// delete
			isDeleteOpen,
			openDelete,
			closeDelete,

			deleteStatus,
			deleteMessage,

			setDeleteStatus,
			setDeleteMessage,
		}),
		[
			search,
			status,
			category,
			type,

			page,
			perPage,
			total,
			lastPage,

			paginated,
			filtered,

			refs,

			loading,

			isCreateOpen,
			createStatus,
			createMessage,

			isEditOpen,
			selectedProject,
			editStatus,
			editMessage,

			isDeleteOpen,
			deleteStatus,
			deleteMessage,
		]
	)

	return <proyectContext.Provider value={contextValue}>{children}</proyectContext.Provider>
}
