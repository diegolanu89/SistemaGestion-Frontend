import { FC } from 'react'
import { useProyectContext } from '../hooks/useProyectContext.h'
import { ClearFiltersButton } from '../../base/components/ClearFiltersButton/ClearFiltersButton'

export const ProyectClearFilters: FC = () => {
	const { search, status, category, type, setSearch, setStatus, setCategory, setType } = useProyectContext()

	const hasActiveFilters = search !== '' || status !== 'all' || category !== 'all' || type !== 'all'

	const handleClear = () => {
		setSearch('')
		setStatus('all')
		setCategory('all')
		setType('all')
	}

	return <ClearFiltersButton active={hasActiveFilters} onClear={handleClear} />
}
