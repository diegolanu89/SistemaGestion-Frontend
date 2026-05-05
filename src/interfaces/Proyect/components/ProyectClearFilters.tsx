import { FC } from 'react'
import { useProyectContext } from '../hooks/useProyectContext.h'

export const ProyectClearFilters: FC = () => {
	const { search, status, category, type, setSearch, setStatus, setCategory, setType } = useProyectContext()

	const hasActiveFilters = search !== '' || status !== 'all' || category !== 'all' || type !== 'all'

	if (!hasActiveFilters) return null

	const handleClear = () => {
		setSearch('')
		setStatus('all')
		setCategory('all')
		setType('all')
	}

	return (
		<button
			className="proyect-filters__refresh-btn proyect-filters__clear-btn"
			onClick={handleClear}
			data-tooltip="Limpiar filtros"
		>
			<span className="material-icons">filter_list_off</span>
		</button>
	)
}
