/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, ReactNode, useState } from 'react'
import { estimatedProjectContext } from '../hooks/useEstimatedProjectContext.h'
import { CreateStatus, IEstimatedProjectContext } from '../models/IEstimatedProjectContext.m'

import { useEstimatedProjectData } from '../hooks/useEstimatedProjectData.h'
import { useEstimatedProjectRefs } from '../hooks/useEstimatedProjectRefs.h'

interface IProviderProps {
	children: ReactNode
}

export const EstimatedProjectProvider = ({ children }: IProviderProps) => {
	// ==========================
	// 🔹 CREATE UX STATE
	// ==========================
	const [createStatus, setCreateStatus] = useState<CreateStatus>('idle')
	const [createMessage, setCreateMessage] = useState<string | null>(null)

	// ==========================
	// 🔹 DATA
	// ==========================
	const { data, loading: loadingData, refetch: refetchData } = useEstimatedProjectData()

	// ==========================
	// 🔹 REFS
	// ==========================
	const { refs, loading: loadingRefs, refetch: refetchRefs } = useEstimatedProjectRefs()

	// ==========================
	// 🔹 FILTER STATE
	// ==========================
	const [search, setSearch] = useState<string>('')

	// ==========================
	// 🔹 FILTERED DATA
	// ==========================
	const filtered = useMemo(() => {
		const searchLower = search.toLowerCase().trim()
		if (!searchLower) return data

		return data.filter((p) => {
			const project = p.Name?.toLowerCase() ?? ''
			const client = p.ClientName?.toLowerCase() ?? ''
			const code = p.Code?.toLowerCase() ?? ''
			return project.includes(searchLower) || client.includes(searchLower) || code.includes(searchLower)
		})
	}, [data, search])

	// ==========================
	// 🔥 REFRESH UNIFICADO
	// ==========================
	const refetch = async (): Promise<void> => {
		await Promise.all([refetchData(), refetchRefs()])
	}

	const loading = loadingData || loadingRefs

	const contextValue = useMemo<IEstimatedProjectContext>(
		() => ({
			search,
			setSearch,

			filtered,
			refs,

			loading,
			refetch,

			createStatus,
			createMessage,
			setCreateStatus,
			setCreateMessage,
		}),
		[search, filtered, refs, loading, createStatus, createMessage]
	)

	return <estimatedProjectContext.Provider value={contextValue}>{children}</estimatedProjectContext.Provider>
}
