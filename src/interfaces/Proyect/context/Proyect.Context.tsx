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

export const ProyectProvider = ({ children }: IProviderProps) => {
	// ==========================
	// 🔹 DATA
	// ==========================
	const { data, loading: loadingData, refetch: refetchData } = useProyectData()

	// ==========================
	// 🔹 REFS
	// ==========================
	const { refs, loading: loadingRefs, refetch: refetchRefs } = useProyectRefs()

	// ==========================
	// 🔹 UI STATE
	// ==========================
	const [search, setSearch] = useState<string>('')
	const [status, setStatus] = useState<Status | 'all'>('all')
	const [category, setCategory] = useState<Category | 'all'>('all')
	const [type, setType] = useState<Type | 'all'>('all')

	// ==========================
	// 🔹 FILTER
	// ==========================
	const filtered = useMemo(() => {
		const searchLower = search.toLowerCase()

		return data.filter((p) => {
			const title = p.ProjectName?.toLowerCase() ?? ''
			const desc = p.Observations?.toLowerCase() ?? ''

			const matchSearch = title.includes(searchLower) || desc.includes(searchLower)

			const matchStatus = status === 'all' || p.ProjectStatusCode === status

			const matchCategory = category === 'all' || p.CategoryCode === category

			const matchType = type === 'all' || p.ProjectType === type

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
	// 🔹 LOADING GLOBAL
	// ==========================
	const loading = loadingData || loadingRefs

	// ==========================
	// 🔹 CONTEXT VALUE
	// ==========================
	const contextValue = useMemo<IProyectContext>(
		() => ({
			search,
			status,
			category,
			type,

			setSearch,
			setStatus,
			setCategory,
			setType,

			filtered,
			refs, // 🔥 clave para filtros dinámicos

			loading,
			refetch,
		}),
		[search, status, category, type, filtered, refs, loading]
	)

	return <proyectContext.Provider value={contextValue}>{children}</proyectContext.Provider>
}
