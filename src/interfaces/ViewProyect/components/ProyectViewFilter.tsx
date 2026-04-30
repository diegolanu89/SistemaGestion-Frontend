// components/ProyectViewFilter.tsx

import { FC, useMemo, useCallback } from 'react'
import { useProyectViewContext } from '../hooks/useProyectViewContext.h'
import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'

interface SelectOption {
	value: string
	label: string
}

export const ProyectViewFilters: FC = () => {
	const { projects, filters, setFilters, refetch } = useProyectViewContext()

	const updateFilter = useCallback(
		(key: keyof typeof filters, value: string) => {
			const next = { ...filters, [key]: value }

			logger.infoTag(LogTag.Maps, '[PROJECT] Filter change', {
				key,
				prev: filters[key],
				next: value,
			})

			setFilters(next)
		},
		[filters]
	)

	const clientOptions: SelectOption[] = useMemo(() => {
		const values = Array.from(new Set(projects.map((p) => p.clientName).filter(Boolean)))

		return [
			{ value: 'all', label: 'Todos' },
			...values.map((value) => ({
				value: String(value),
				label: String(value),
			})),
		]
	}, [projects])

	const statusOptions: SelectOption[] = useMemo(() => {
		const values = Array.from(new Set(projects.map((p) => p.status).filter(Boolean)))

		return [
			{ value: 'all', label: 'Todos' },
			...values.map((value) => ({
				value,
				label: value,
			})),
		]
	}, [projects])

	const codeOptions: SelectOption[] = useMemo(() => {
		const values = Array.from(new Set(projects.map((p) => p.code).filter(Boolean)))

		return [
			{ value: 'all', label: 'Todos' },
			...values.map((value) => ({
				value: String(value),
				label: String(value),
			})),
		]
	}, [projects])

	return (
		<div className="proyect-view-filters">
			<div className="proyect-view-search">
				<label className="proyect-view-search__label">Buscar por nombre</label>

				<div className="proyect-view-search__control">
					<span className="material-icons proyect-view-search__icon">search</span>

					<input
						className="proyect-view-search__input"
						value={filters.search}
						placeholder="Buscar proyecto..."
						onChange={(e) => updateFilter('search', e.target.value)}
					/>
				</div>
			</div>

			<div className="proyect-view-filters__field">
				<label className="proyect-view-filters__label">Cliente</label>

				<select className="proyect-view-filters__select" value={filters.client} onChange={(e) => updateFilter('client', e.target.value)}>
					{clientOptions.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>
			</div>

			<div className="proyect-view-filters__field">
				<label className="proyect-view-filters__label">Estado</label>

				<select className="proyect-view-filters__select" value={filters.status} onChange={(e) => updateFilter('status', e.target.value)}>
					{statusOptions.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>
			</div>

			<div className="proyect-view-filters__field">
				<label className="proyect-view-filters__label">Código</label>

				<select className="proyect-view-filters__select" value={filters.code} onChange={(e) => updateFilter('code', e.target.value)}>
					{codeOptions.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>
			</div>

			<div className="proyect-view-filters__refresh">
				<button
					className="proyect-view-filters__refresh-btn"
					onClick={() => {
						logger.infoTag(LogTag.Adapter, '[PROJECT] Manual refetch trigger')
						refetch()
					}}
				>
					<span className="material-icons">refresh</span>
				</button>
			</div>
		</div>
	)
}
