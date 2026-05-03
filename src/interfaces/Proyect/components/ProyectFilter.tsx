// components/ProyectFilters.tsx

import { FC, useMemo } from 'react'
import { useProyectContext } from '../hooks/useProyectContext.h'
import { Category, Status, Type } from '../models/IProyectItem.m'
import { PROYECT_CONFIG } from '../models/ProyectConfig.m'
import { ProyectSearch } from './ProyectSearch'
import { ProyectClearFilters } from './ProyectClearFilters'
import { SelectOption, mapStatusOptions, mapCategoryOptions, mapTypeOptions } from '../models/ProyectMapper.m'

export const ProyectFilters: FC = () => {
	const { status, setStatus, category, setCategory, type, setType, refetch, refs } = useProyectContext()

	const statusOptions: SelectOption[] = useMemo(() => {
		if (!refs) return [{ value: 'all', label: 'Todos' }]

		return [{ value: 'all', label: 'Todos' }, ...mapStatusOptions(refs.statuses)]
	}, [refs])

	const categoryOptions: SelectOption[] = useMemo(() => {
		if (!refs) return [{ value: 'all', label: 'Todas' }]

		return [{ value: 'all', label: 'Todas' }, ...mapCategoryOptions(refs.categories)]
	}, [refs])

	const typeOptions: SelectOption[] = useMemo(() => {
		if (!refs) return [{ value: 'all', label: 'Todos' }]

		return [{ value: 'all', label: 'Todos' }, ...mapTypeOptions(refs.types)]
	}, [refs])

	return (
		<div className="proyect-filters">
			{/* SEARCH */}
			<ProyectSearch />

			{/* STATUS */}
			<div className="proyect-filters__field" data-tooltip={PROYECT_CONFIG.FILTERS.STATUS.TOOLTIP}>
				<label className="proyect-filters__label">{PROYECT_CONFIG.FILTERS.STATUS.LABEL}</label>

				<select className="proyect-filters__select" value={status} onChange={(e) => setStatus(e.target.value as Status | 'all')}>
					{statusOptions.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>
			</div>

			{/* CATEGORY */}
			<div className="proyect-filters__field" data-tooltip={PROYECT_CONFIG.FILTERS.CATEGORY.TOOLTIP}>
				<label className="proyect-filters__label">{PROYECT_CONFIG.FILTERS.CATEGORY.LABEL}</label>

				<select className="proyect-filters__select" value={category} onChange={(e) => setCategory(e.target.value as Category | 'all')}>
					{categoryOptions.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>
			</div>

			{/* TYPE */}
			<div className="proyect-filters__field" data-tooltip={PROYECT_CONFIG.FILTERS.TYPE.TOOLTIP}>
				<label className="proyect-filters__label">{PROYECT_CONFIG.FILTERS.TYPE.LABEL}</label>

				<select className="proyect-filters__select" value={type} onChange={(e) => setType(e.target.value as Type | 'all')}>
					{typeOptions.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>
			</div>

			{/* ACTIONS */}
			<div className="proyect-filters__refresh">
				<ProyectClearFilters />
				<button className="proyect-filters__refresh-btn" onClick={refetch} data-tooltip={PROYECT_CONFIG.ACTIONS.REFRESH_TOOLTIP}>
					<span className="material-icons">{PROYECT_CONFIG.ACTIONS.REFRESH_ICON}</span>
				</button>
			</div>
		</div>
	)
}
