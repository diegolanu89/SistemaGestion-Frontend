import { useMemo, ReactNode, useState } from 'react'
import { IProyectViewContext } from '../models/IProyectViewContext.m'
import { proyectViewContext } from '../hooks/useProyectViewContext.h'
import { ProjectDto } from '../models/ProyectViewDTO.m'

interface IProviderProps {
	children: ReactNode
}

export const ProyectViewProvider = ({ children }: IProviderProps) => {
	const [projects, setProjects] = useState<ProjectDto[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const [page, setPage] = useState(1)
	const [perPage, setPerPage] = useState(15)
	const [total, setTotal] = useState(0)

	const [filters, setFilters] = useState({
		search: '',
		client: 'all',
		status: 'all',
		code: 'all',
	})

	const [refetchFn, setRefetchFn] = useState<() => Promise<void>>(async () => {})

	const contextValue = useMemo<IProyectViewContext>(
		() => ({
			projects,
			setProjects,
			loading,
			setLoading,
			error,
			setError,
			page,
			setPage,
			perPage,
			setPerPage,
			total,
			setTotal,

			filters,
			setFilters,

			refetch: refetchFn,
			setRefetch: setRefetchFn,
		}),
		[projects, loading, error, page, perPage, total, filters, refetchFn]
	)

	return <proyectViewContext.Provider value={contextValue}>{children}</proyectViewContext.Provider>
}
