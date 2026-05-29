// components/DashboardHoursToolbar.tsx

import { FC, useEffect, useMemo, useState } from 'react'

import { useDashboardHoursContext } from '../hooks/useEstimatedProjectContext.h'

import DashboardHoursFiltersModal from './DashBoardHoursFilterModal'

export const DashboardHoursToolbar: FC = () => {
	const {
		filters,

		savedFilters,

		loadSavedFilters,

		saveCurrentFilter,

		applySavedFilter,

		clearFilters,
	} = useDashboardHoursContext()

	// =========================================================
	// 🔹 LOCAL STATE
	// =========================================================

	const [filterName, setFilterName] = useState<string>('')

	const [saving, setSaving] = useState<boolean>(false)

	const [savedSuccess, setSavedSuccess] = useState<boolean>(false)

	const [selectedFilterId, setSelectedFilterId] = useState<string>('')

	const [isManageModalOpen, setIsManageModalOpen] = useState<boolean>(false)

	// =========================================================
	// 🔹 INIT
	// =========================================================

	useEffect(() => {
		loadSavedFilters()
	}, [loadSavedFilters])

	// =========================================================
	// 🔹 ACTIVE FILTERS
	// =========================================================

	const hasActiveFilters = useMemo(() => {
		return Boolean(filters.leader_id || filters.project_id || filters.month_keys?.length || (filters.source_type && filters.source_type !== 'ALL'))
	}, [filters])

	// =========================================================
	// 🔹 SAVE
	// =========================================================

	const handleSaveFilter = async () => {
		try {
			setSaving(true)

			setSavedSuccess(false)

			await saveCurrentFilter({
				name: filterName,

				leaderId: filters.leader_id ?? null,

				projectId: filters.project_id ?? null,

				monthKeys: filters.month_keys ?? [],

				sourceType: filters.source_type ?? 'ALL',
			})

			await loadSavedFilters()

			setFilterName('')

			setSavedSuccess(true)

			setTimeout(() => {
				setSavedSuccess(false)
			}, 2500)
		} catch (error: unknown) {
			console.error(error)
		} finally {
			setSaving(false)
		}
	}

	// =========================================================
	// 🔹 APPLY FILTER
	// =========================================================

	const handleSelectFilter = (filterId: string) => {
		setSelectedFilterId(filterId)

		// ====================================
		// 🔹 CLEAR FILTERS
		// ====================================

		if (!filterId) {
			clearFilters()

			return
		}

		// ====================================
		// 🔹 APPLY FILTER
		// ====================================

		const filter = savedFilters.find((f) => String(f.id) === filterId)

		if (!filter) return

		applySavedFilter(filter)
	}

	return (
		<>
			<div className="dashboard-hours-toolbar">
				{/* ====================================== */}
				{/* 🔹 LEFT */}
				{/* ====================================== */}

				<div className="dashboard-hours-toolbar__left">
					<div className="dashboard-hours-toolbar__save">
						<div className="dashboard-hours-toolbar__input-wrapper">
							<span className="material-icons dashboard-hours-toolbar__input-icon">bookmark</span>

							<input
								type="text"
								placeholder="Nombre del filtro"
								value={filterName}
								onChange={(e) => setFilterName(e.target.value)}
								className="dashboard-hours-toolbar__input"
							/>
						</div>

						<button
							className={`dashboard-hours-toolbar__save-btn ${saving ? 'is-saving' : ''} ${savedSuccess ? 'is-success' : ''}`}
							disabled={!hasActiveFilters || !filterName.trim() || saving}
							onClick={handleSaveFilter}
						>
							<span className={`material-icons ${saving ? 'spin' : ''}`}>{saving ? 'progress_activity' : savedSuccess ? 'check_circle' : 'save'}</span>

							<span>{saving ? 'Guardando...' : savedSuccess ? 'Guardado' : 'Guardar filtro'}</span>
						</button>
					</div>
				</div>

				{/* ====================================== */}
				{/* 🔹 RIGHT */}
				{/* ====================================== */}

				<div className="dashboard-hours-toolbar__right">
					<div className="dashboard-hours-toolbar__saved-wrapper">
						<span className="material-icons dashboard-hours-toolbar__saved-icon">bookmarks</span>

						<select
							className="dashboard-hours-toolbar__saved-select"
							value={selectedFilterId}
							disabled={savedFilters.length === 0}
							onChange={(e) => handleSelectFilter(e.target.value)}
						>
							{/* ====================================== */}
							{/* 🔹 EMPTY */}
							{/* ====================================== */}

							{savedFilters.length === 0 ? (
								<option value="">No hay filtros guardados</option>
							) : (
								<>
									{/* ====================================== */}
									{/* 🔹 DEFAULT */}
									{/* ====================================== */}

									<option value="">{selectedFilterId ? 'Aplicar ningún filtro' : 'Aplicar filtro guardado'}</option>

									{/* ====================================== */}
									{/* 🔹 FILTERS */}
									{/* ====================================== */}

									{savedFilters.map((filter) => (
										<option key={filter.id} value={String(filter.id)}>
											{filter.name}
										</option>
									))}
								</>
							)}
						</select>
					</div>

					<button className="dashboard-hours-toolbar__manage-btn" data-tooltip="Administrar filtros" onClick={() => setIsManageModalOpen(true)}>
						<span className="material-icons">tune</span>
					</button>
				</div>
			</div>

			{/* ===================================================== */}
			{/* 🔹 MODAL */}
			{/* ===================================================== */}

			<DashboardHoursFiltersModal open={isManageModalOpen} onClose={() => setIsManageModalOpen(false)} />
		</>
	)
}

export default DashboardHoursToolbar
