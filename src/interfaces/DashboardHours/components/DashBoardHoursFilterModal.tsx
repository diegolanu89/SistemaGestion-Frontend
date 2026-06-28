// components/DashboardHoursFiltersModal.tsx

import { FC, useMemo, useState } from 'react'

import { useDashboardHoursContext } from '../hooks/useEstimatedProjectContext.h'

import { DashboardFilterDto, DashboardHoursProjectOptionDto } from '../model/DashboardHoursDTO.m'
import InlineStatusMessage from '../../base/components/alert/InlineStatusMessage'

interface Props {
	open: boolean

	onClose: () => void
}

const DashboardHoursFiltersModal: FC<Props> = ({ open, onClose }) => {
	const {
		savedFilters,
		dashboard,
		updateSavedFilter,
		deleteSavedFilter,

		activeSavedFilterId,
		setActiveSavedFilterId,
		clearFilters,
	} = useDashboardHoursContext()

	// =====================================================
	// 🔹 LOCAL STATE
	// =====================================================

	const [editingFilterId, setEditingFilterId] = useState<number | null>(null)

	const [editingName, setEditingName] = useState<string>('')

	const [loadingId, setLoadingId] = useState<number | null>(null)

	const [search, setSearch] = useState<string>('')

	const [errorMessage, setErrorMessage] = useState<string | null>(null)

	// =====================================================
	// 🔹 PROJECT MAP
	// =====================================================

	const projectsMap = useMemo(() => {
		const map = new Map<string, DashboardHoursProjectOptionDto>()

		dashboard?.options?.projects?.forEach((project) => {
			map.set(String(project.id), project)
		})

		return map
	}, [dashboard])

	// =====================================================
	// 🔹 FILTERED LIST
	// =====================================================

	const filteredFilters = useMemo(() => {
		const normalized = search.trim().toLowerCase()

		if (!normalized) return savedFilters

		return savedFilters.filter((filter) => {
			const project = projectsMap.get(String(filter.projectId))

			const projectName = project?.name ?? ''

			return filter.name.toLowerCase().includes(normalized) || projectName.toLowerCase().includes(normalized)
		})
	}, [search, savedFilters, projectsMap])

	// =====================================================
	// 🔹 START EDIT
	// =====================================================

	const handleStartEdit = (filter: DashboardFilterDto) => {
		setErrorMessage(null)
		setEditingFilterId(filter.id)
		setEditingName(filter.name)
	}

	// =====================================================
	// 🔹 CANCEL EDIT
	// =====================================================

	const handleCancelEdit = () => {
		setEditingFilterId(null)
		setEditingName('')
		setErrorMessage(null)
	}

	// =====================================================
	// 🔹 SAVE EDIT
	// =====================================================

	const handleSaveEdit = async (filter: DashboardFilterDto) => {
		setErrorMessage(null)

		try {
			setLoadingId(filter.id)

			await updateSavedFilter(filter.id, {
				name: editingName,

				leaderId: filter.leaderId,

				projectId: filter.projectId,

				monthKeys: filter.monthKeys ?? [],

				sourceType: filter.sourceType,
			})

			setEditingFilterId(null)

			setEditingName('')
		} catch (error: unknown) {
			setErrorMessage(error instanceof Error ? error.message : 'No fue posible actualizar el filtro.')
		} finally {
			setLoadingId(null)
		}
	}

	// =====================================================
	// 🔹 DELETE
	// =====================================================

	const handleDelete = async (id: number) => {
		setErrorMessage(null)

		try {
			setLoadingId(id)

			await deleteSavedFilter(id)

			// Si era el filtro aplicado actualmente
			if (String(activeSavedFilterId) === String(id)) {
				setActiveSavedFilterId('')
				clearFilters()
			}
		} catch (error: unknown) {
			setErrorMessage(error instanceof Error ? error.message : 'No fue posible eliminar el filtro.')
		} finally {
			setLoadingId(null)
		}
	}

	// =====================================================
	// 🔹 CLOSE
	// =====================================================

	if (!open) return null

	return (
		<div className="dashboard-filters-modal">
			<div
				className="dashboard-filters-modal__overlay"
				onClick={() => {
					setErrorMessage(null)
					onClose()
				}}
			/>

			<div className="dashboard-filters-modal__content">
				{/* ======================================== */}
				{/* 🔹 HEADER */}
				{/* ======================================== */}

				<div className="dashboard-filters-modal__header">
					<div>
						<h3>Administrar filtros</h3>

						<p>Gestioná filtros guardados del dashboard.</p>
					</div>

					<button
						className="dashboard-filters-modal__close"
						onClick={() => {
							setErrorMessage(null)
							onClose()
						}}
					>
						<span className="material-icons">close</span>
					</button>
				</div>

				{/* ======================================== */}
				{/* 🔹 SEARCH */}
				{/* ======================================== */}

				<div className="dashboard-filters-modal__search">
					<span className="material-icons">search</span>

					<input type="text" placeholder="Buscar filtros..." value={search} onChange={(e) => setSearch(e.target.value)} />
				</div>

				{errorMessage && <InlineStatusMessage type="error" message={errorMessage} />}

				{/* ======================================== */}
				{/* 🔹 TABLE */}
				{/* ======================================== */}

				<div className="dashboard-filters-modal__table-wrapper">
					<table className="dashboard-filters-modal__table">
						<thead>
							<tr>
								<th>Filtro</th>

								<th>Origen</th>
								<th>Proyecto</th>
								<th className="dashboard-filters-modal__actions-column">Acciones</th>
							</tr>
						</thead>

						<tbody>
							{filteredFilters.length === 0 ? (
								<tr>
									<td colSpan={3}>
										<div className="dashboard-filters-modal__empty">
											<span className="material-icons">filter_alt_off</span>

											<p>No se encontraron filtros.</p>
										</div>
									</td>
								</tr>
							) : (
								filteredFilters.map((filter) => {
									const project = projectsMap.get(String(filter.projectId))

									return (
										<tr key={filter.id}>
											{/* ================================= */}
											{/* 🔹 FILTER NAME */}
											{/* ================================= */}

											<td>
												{editingFilterId === filter.id ? (
													<input value={editingName} onChange={(e) => setEditingName(e.target.value)} className="dashboard-filters-modal__input" />
												) : (
													<div className="dashboard-filters-modal__filter">
														<strong className="dashboard-filters-modal__filter-name">{filter.name}</strong>
													</div>
												)}
											</td>

											<td>
												<span className="dashboard-filters-modal__filter-type">
													{filter.sourceType === 'ALL'
														? 'Todos'
														: filter.sourceType === 'ETC'
															? 'ETC'
															: filter.sourceType === 'POTENTIAL'
																? 'Potenciales'
																: 'Horas Reales'}
												</span>
											</td>

											{/* ================================= */}
											{/* 🔹 PROJECT */}
											{/* ================================= */}

											<td>
												<div className="dashboard-filters-modal__project">
													<div className="dashboard-filters-modal__project-main">
														<strong>{project?.name ?? 'Todos los proyectos'}</strong>

														{project?.project_type && <span className="dashboard-filters-modal__badge">{project.project_type}</span>}
													</div>

													<small className="dashboard-filters-modal__project-client">
														{filter.projectId ? `Proyecto ID: ${filter.projectId}` : 'Sin proyecto asociado'}
													</small>
												</div>
											</td>

											{/* ================================= */}
											{/* 🔹 ACTIONS */}
											{/* ================================= */}

											<td>
												<div className="dashboard-filters-modal__actions">
													{editingFilterId === filter.id ? (
														<>
															<button
																className="dashboard-filters-modal__icon-btn success"
																onClick={() => handleSaveEdit(filter)}
																disabled={loadingId === filter.id || !editingName.trim()}
															>
																<span className="material-icons">check</span>
															</button>

															<button className="dashboard-filters-modal__icon-btn" onClick={handleCancelEdit}>
																<span className="material-icons">close</span>
															</button>
														</>
													) : (
														<button className="dashboard-filters-modal__icon-btn" onClick={() => handleStartEdit(filter)}>
															<span className="material-icons">edit</span>
														</button>
													)}

													<button
														className="dashboard-filters-modal__icon-btn danger"
														onClick={() => handleDelete(filter.id)}
														disabled={loadingId === filter.id}
													>
														<span className="material-icons">delete</span>
													</button>
												</div>
											</td>
										</tr>
									)
								})
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}

export default DashboardHoursFiltersModal
