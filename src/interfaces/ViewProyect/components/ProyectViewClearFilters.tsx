import { FC } from 'react'
import { useProyectViewContext } from '../hooks/useProyectViewContext.h'
import { ClearFiltersButton } from '../../base/components/ClearFiltersButton/ClearFiltersButton'

export const ProyectViewClearFilters: FC = () => {
	const { filters, setFilters } = useProyectViewContext()

	const hasActiveFilters = filters.search !== '' || filters.client !== 'all' || filters.status !== 'all' || filters.code !== ''

	const handleClear = () => {
		setFilters({ search: '', client: 'all', status: 'all', code: '' })
	}

	return <ClearFiltersButton active={hasActiveFilters} onClear={handleClear} />
}
