/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, ReactNode, useState } from 'react'
import { proyectContext } from '../hooks/useProyectContext.h'
import { IProyectContext } from '../models/IProyectContext.m'
import { Category, Status, Type } from '../models/IProyectItem.m'

import { useProyectData } from '../hooks/useProyectData.h'
import { useProyectRefs } from '../hooks/useProyectRef.h'

interface IProviderProps {
	children: ReactNode
}

type CreateStatus = 'idle' | 'loading' | 'success' | 'error'

export const ProyectProvider = ({ children }: IProviderProps) => {
	// ==========================
	// 🔹 MODAL STATE
	// ==========================
	const [isCreateOpen, setIsCreateOpen] = useState(false)

	const openCreate = () => setIsCreateOpen(true)
	const closeCreate = () => setIsCreateOpen(false)

	// ==========================
	// 🔹 CREATE UX STATE (GLOBAL)
	// ==========================
	const [createStatus, setCreateStatus] = useState<CreateStatus>('idle')
	const [createMessage, setCreateMessage] = useState<string | null>(null)

	// ==========================
	// 🔹 DATA
	// ==========================
	const { data, loading: loadingData, refetch: refetchData } = useProyectData()

	// ==========================
	// 🔹 REFS
	// ==========================
	const { refs, loading: loadingRefs, refetch: refetchRefs } = useProyectRefs()

	// ==========================
	// 🔹 FILTER STATE
	// ==========================
	const [search, setSearch] = useState<string>('')
	const [status, setStatus] = useState<Status | 'all'>('all')
	const [category, setCategory] = useState<Category | 'all'>('all')
	const [type, setType] = useState<Type | 'all'>('all')

	// ==========================
	// 🔹 FILTERED DATA
	// ==========================
	const filtered = useMemo(() => {
		const searchLower = search.toLowerCase()

		return data.filter((p) => {
			const title = p.projectName?.toLowerCase() ?? ''
			const desc = p.observations?.toLowerCase() ?? ''

			const matchSearch = title.includes(searchLower) || desc.includes(searchLower)

			const matchStatus = status === 'all' || p.projectStatusCode === status

			const matchCategory = category === 'all' || p.categoryCode === category

			const matchType = type === 'all' || p.projectType === type

			return matchSearch && matchStatus && matchCategory && matchType
		})
	}, [data, search, status, category, type])

	// ==========================
	// 🔥 REFRESH UNIFICADO
	// ==========================
	const refetch = async (): Promise<void> => {
		await Promise.all([refetchData(), refetchRefs()])
	}

	// ==========================
	// 🔹 GLOBAL LOADING
	// ==========================
	const loading = loadingData || loadingRefs

	// ==========================
	// 🔹 CONTEXT VALUE
	// ==========================
	const contextValue = useMemo<IProyectContext>(
		() => ({
			// filtros
			search,
			status,
			category,
			type,

			setSearch,
			setStatus,
			setCategory,
			setType,

			filtered,
			refs,

			loading,
			refetch,

			// modal create
			isCreateOpen,
			openCreate,
			closeCreate,

			// ✅ create UX
			createStatus,
			createMessage,
			setCreateStatus,
			setCreateMessage,
		}),
		[search, status, category, type, filtered, refs, loading, isCreateOpen, createStatus, createMessage]
	)

	return <proyectContext.Provider value={contextValue}>{children}</proyectContext.Provider>
}
