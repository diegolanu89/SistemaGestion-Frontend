import { FC } from 'react'

import { useVisibleProjectsController } from '../hooks/useVisibleProjectController.h'
import { ClearFiltersButton } from '../../base/components/ClearFiltersButton/ClearFiltersButton'

type Ctrl = ReturnType<typeof useVisibleProjectsController>

interface Props {
	ctrl: Ctrl
}

const MyProjectsFilters: FC<Props> = ({ ctrl }) => {
	const { search, setSearch, client, setClient, code, setCode, status, setStatus, clearFilters, hasFilters, clientOptions, statusOptions } = ctrl

	return (
		<div className="proyect-view-filters">
			<div className="proyect-view-search">
				<label className="proyect-view-search__label">Buscar por nombre</label>

				<div className="proyect-view-search__control">
					<span className="material-icons proyect-view-search__icon">search</span>

					<input
						className="proyect-view-search__input"
						value={search}
						placeholder="Buscar proyecto..."
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
			</div>

			<div className="proyect-view-filters__field">
				<label className="proyect-view-filters__label">Cliente</label>

				<select className="proyect-view-filters__select" value={client} onChange={(e) => setClient(e.target.value)}>
					{clientOptions.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>
			</div>

			<div className="proyect-view-filters__field">
				<label className="proyect-view-filters__label">Estado</label>

				<select className="proyect-view-filters__select" value={status} onChange={(e) => setStatus(e.target.value)}>
					{statusOptions.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>
			</div>

			<div className="proyect-view-search">
				<label className="proyect-view-search__label">Código</label>

				<div className="proyect-view-search__control">
					<span className="material-icons proyect-view-search__icon">tag</span>

					<input
						className="proyect-view-search__input"
						value={code}
						placeholder="Ej: 30.006"
						onChange={(e) => setCode(e.target.value.toUpperCase())}
					/>
				</div>
			</div>

			<div className="proyect-view-filters__refresh">
				<ClearFiltersButton active={hasFilters} onClear={clearFilters} />
			</div>
		</div>
	)
}

export default MyProjectsFilters
