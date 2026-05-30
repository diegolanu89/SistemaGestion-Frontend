import React, { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { userLeadersBDT } from '../services/UserLeadersBDT'
import type { UserLeaderDto } from '../models/UserLeader.m'
import { ClearFiltersButton } from '../../base/components/ClearFiltersButton/ClearFiltersButton'

const UserLeadersTab: React.FC = () => {
	const [data, setData] = useState<UserLeaderDto[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [formError, setFormError] = useState<string | null>(null)
	const [showDeleteModal, setShowDeleteModal] = useState(false)
	const [itemToDelete, setItemToDelete] = useState<UserLeaderDto | null>(null)
	const [deleting, setDeleting] = useState(false)
	const [options, setOptions] = useState<Array<{ id: number; name: string; email: string }>>([])

	const [showModal, setShowModal] = useState(false)
	const [editingId, setEditingId] = useState<number | null>(null)
	const [formUserIds, setFormUserIds] = useState<number[]>([])
	const [formLeaderId, setFormLeaderId] = useState<number>(0)
	const [userSearchQuery, setUserSearchQuery] = useState('')

	const [filterLeaderIds, setFilterLeaderIds] = useState<number[]>([])
	const [filterLeaderSearch, setFilterLeaderSearch] = useState('')
	const [filterExpanded, setFilterExpanded] = useState(false)
	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = 10

	const leadersForFilter = useMemo(() => {
		const seen = new Map<number, { id: number; name: string }>()
		data.forEach((d) => {
			if (d.leaderId && !seen.has(d.leaderId)) {
				const name = d.leader?.name ?? options.find((u) => u.id === d.leaderId)?.name ?? `ID: ${d.leaderId}`
				seen.set(d.leaderId, { id: d.leaderId, name })
			}
		})
		return Array.from(seen.values()).sort((a, b) => a.name.localeCompare(b.name))
	}, [data, options])

	const filteredLeadersForFilter = useMemo(() => {
		if (!filterLeaderSearch.trim()) return leadersForFilter
		const q = filterLeaderSearch.toLowerCase().trim()
		return leadersForFilter.filter((u) => u.name.toLowerCase().includes(q))
	}, [leadersForFilter, filterLeaderSearch])

	const filteredUsersForSelect = useMemo(() => {
		if (!userSearchQuery.trim()) return options
		const q = userSearchQuery.toLowerCase().trim()
		return options.filter((u) => u.name.toLowerCase().includes(q))
	}, [options, userSearchQuery])

	const loadData = async () => {
		setLoading(true)
		setError(null)
		try {
			const items = await userLeadersBDT.list({ per_page: 1000 })
			setData(items)
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'Error al cargar los datos')
		} finally {
			setLoading(false)
		}
	}

	const loadOptions = async () => {
		try {
			const opts = await userLeadersBDT.getOptions()
			setOptions(opts)
		} catch (err) {
			console.error('Error loading options:', err)
		}
	}

	useEffect(() => { loadData(); loadOptions() }, []) // eslint-disable-line react-hooks/exhaustive-deps

	const filteredData = useMemo(() => {
		if (filterLeaderIds.length === 0) return data
		const ids = new Set(filterLeaderIds)
		return data.filter((item) => ids.has(item.leaderId))
	}, [data, filterLeaderIds])

	const paginatedData = useMemo(() => {
		const start = (currentPage - 1) * itemsPerPage
		return filteredData.slice(start, start + itemsPerPage)
	}, [filteredData, currentPage])

	const totalPages = Math.ceil(filteredData.length / itemsPerPage)

	const handleCreate = () => {
		setEditingId(null)
		setFormUserIds([])
		setFormLeaderId(0)
		setUserSearchQuery('')
		setFormError(null)
		setShowModal(true)
	}

	const handleEdit = (item: UserLeaderDto) => {
		setEditingId(item.id || null)
		setFormUserIds([item.userId])
		setFormLeaderId(item.leaderId)
		setUserSearchQuery('')
		setFormError(null)
		setShowModal(true)
	}

	const toggleUser = (userId: number) => {
		if (editingId) return
		setFormUserIds((prev) => prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId])
	}

	const handleSelectAllUsers = () => {
		if (editingId) return
		const filtered = filteredUsersForSelect.filter((u) => u.id !== formLeaderId)
		const allSelected = filtered.every((u) => formUserIds.includes(u.id))
		setFormUserIds(allSelected ? [] : filtered.map((u) => u.id))
	}

	const handleSave = async () => {
		if (!formLeaderId) { setFormError('Debe seleccionar un líder'); return }
		if (editingId && formUserIds.length !== 1) { setFormError('En edición debe haber un solo usuario'); return }
		if (!editingId && formUserIds.length === 0) { setFormError('Debe seleccionar al menos un usuario'); return }

		setFormError(null)
		setLoading(true)
		try {
			if (editingId) {
				await userLeadersBDT.update(editingId, { leaderId: formLeaderId })
			} else {
				await userLeadersBDT.createBulk({ userIds: formUserIds, leaderId: formLeaderId })
			}
			setShowModal(false)
			loadData()
		} catch (err: unknown) {
			setFormError(err instanceof Error ? err.message : 'Error al guardar')
		} finally {
			setLoading(false)
		}
	}

	const requestDelete = (item: UserLeaderDto) => {
		setItemToDelete(item)
		setShowDeleteModal(true)
	}

	const confirmDelete = async () => {
		if (!itemToDelete?.id) return
		setDeleting(true)
		setError(null)
		try {
			await userLeadersBDT.remove(itemToDelete.id)
			setShowDeleteModal(false)
			setItemToDelete(null)
			loadData()
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'Error al eliminar')
			setShowDeleteModal(false)
		} finally {
			setDeleting(false)
		}
	}

	return (
		<div className="conf-tab">
			<div className="conf-tab__header">
				<h2 className="conf-tab__title">Relaciones Usuario-Líder</h2>
				<button className="proyect__add-btn" onClick={handleCreate}>
					<span className="material-icons">add</span>
					<span>Nueva relación</span>
				</button>
			</div>

			{error && <div className="conf-tab__error">{error}</div>}

			<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
				<div className="conf-tab__filters">
					<div className="conf-tab__search-wrapper">
						<span className="material-icons conf-tab__search-icon">search</span>
						<input
							type="text"
							className="conf-tab__search-input"
							placeholder="Buscar líder para filtrar..."
							value={filterLeaderSearch}
							onChange={(e) => { setFilterLeaderSearch(e.target.value); if (!filterExpanded) setFilterExpanded(true) }}
							onFocus={() => setFilterExpanded(true)}
						/>
					</div>
					<ClearFiltersButton
						active={filterLeaderSearch.trim() !== '' || filterLeaderIds.length > 0}
						onClear={() => { setFilterLeaderSearch(''); setFilterLeaderIds([]); setFilterExpanded(false); setCurrentPage(1) }}
						tooltip="Limpiar filtros"
					/>
				</div>

				{filterLeaderIds.length > 0 && (
					<div className="conf-tab__filter-tags">
						{filterLeaderIds.map((id) => {
							const name = leadersForFilter.find((u) => u.id === id)?.name ?? data.find((d) => d.leaderId === id)?.leader?.name ?? `ID: ${id}`
							return (
								<span
									key={id}
									className="conf-modal__tag"
									onClick={() => { setFilterLeaderIds((prev) => prev.filter((i) => i !== id)); setCurrentPage(1) }}
									title="Quitar filtro"
								>
									{name} ×
								</span>
							)
						})}
					</div>
				)}

				{filterExpanded && (
					<div className="conf-modal__filter-panel">
						<div className="conf-modal__filter-panel-header">
							<button type="button" className="conf-modal__select-all-btn" onClick={() => {
								const allSelected = filteredLeadersForFilter.every((u) => filterLeaderIds.includes(u.id))
								setFilterLeaderIds(allSelected ? [] : filteredLeadersForFilter.map((u) => u.id))
								setCurrentPage(1)
							}}>
								{filteredLeadersForFilter.every((u) => filterLeaderIds.includes(u.id)) ? 'Deseleccionar todos' : 'Seleccionar todos'}
							</button>
							<button type="button" className="conf-modal__select-all-btn" onClick={() => setFilterExpanded(false)}>Cerrar</button>
						</div>
						<div className="conf-modal__users-grid" style={{ maxHeight: 160 }}>
							{filteredLeadersForFilter.length === 0 ? (
								<div className="conf-modal__no-results">
									{filterLeaderSearch ? `No se encontraron líderes que coincidan con "${filterLeaderSearch}"` : 'No hay líderes en las relaciones'}
								</div>
							) : (
								filteredLeadersForFilter.map((leader) => (
									<label
										key={leader.id}
										className={`conf-modal__user-checkbox${filterLeaderIds.includes(leader.id) ? ' checked' : ''}`}
									>
										<input
											type="checkbox"
											checked={filterLeaderIds.includes(leader.id)}
											onChange={() => { setFilterLeaderIds((prev) => prev.includes(leader.id) ? prev.filter((id) => id !== leader.id) : [...prev, leader.id]); setCurrentPage(1) }}
										/>
										<span className="conf-modal__user-name">{leader.name}</span>
									</label>
								))
							)}
						</div>
					</div>
				)}
			</div>

			{loading && !data.length ? (
				<div className="conf-tab__loading">Cargando...</div>
			) : (
				<>
					<div className="conf-tab__table-wrapper">
						<table className="conf-tab__table">
							<thead>
								<tr>
									<th>Usuario</th>
									<th>Líder</th>
									<th>Acciones</th>
								</tr>
							</thead>
							<tbody>
								{paginatedData.map((item) => (
									<tr key={item.id}>
										<td>{item.user?.name || `ID: ${item.userId}`}</td>
										<td>{item.leader?.name || `ID: ${item.leaderId}`}</td>
										<td>
											<div className="conf-tab__row-actions">
												<button className="proyect-table__action proyect-table__action--edit" onClick={() => handleEdit(item)} data-tooltip="Editar">
													<span className="material-icons">edit</span>
												</button>
												<button className="proyect-table__action proyect-table__action--delete" onClick={() => requestDelete(item)} data-tooltip="Eliminar">
													<span className="material-icons">delete</span>
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{totalPages > 1 && (
						<div className="conf-tab__pagination">
							<button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Anterior</button>
							<span>Página {currentPage} de {totalPages}</span>
							<button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Siguiente</button>
						</div>
					)}
				</>
			)}

			{showModal && (
				<div className="modal-overlay" onClick={() => setShowModal(false)}>
					<div className="modal conf-modal--md" onClick={(e) => e.stopPropagation()}>
						<div className="modal__header">
							<h2>{editingId ? 'Editar' : 'Nueva'} relación</h2>
							<button onClick={() => setShowModal(false)}>×</button>
						</div>
						<div className="modal__body">
							<div className="conf-form">
								<div className="conf-form__group">
									<div className="conf-form__select-header">
										<label className="conf-form__label">Usuarios *</label>
										{formUserIds.length > 0 && <span className="conf-modal__selected-count">{formUserIds.length} seleccionado(s)</span>}
									</div>
									{!editingId && (
										<>
											<div className="conf-modal__search-container">
												<input type="text" placeholder="Buscar usuario..." value={userSearchQuery} onChange={(e) => setUserSearchQuery(e.target.value)} />
											</div>
											<div className="conf-modal__select-all-container">
												<button type="button" className="conf-modal__select-all-btn" onClick={handleSelectAllUsers}>
													{filteredUsersForSelect.every((u) => formUserIds.includes(u.id)) ? 'Deseleccionar todos' : 'Seleccionar todos'}
												</button>
											</div>
											<div className="conf-modal__users-grid">
												{filteredUsersForSelect.filter((u) => u.id !== formLeaderId).map((user) => (
													<label key={user.id} className={`conf-modal__user-checkbox${formUserIds.includes(user.id) ? ' checked' : ''}`}>
														<input type="checkbox" checked={formUserIds.includes(user.id)} onChange={() => toggleUser(user.id)} />
														<span className="conf-modal__user-name">{user.name}</span>
													</label>
												))}
											</div>
										</>
									)}
									{editingId && (
										<div className="conf-form__user-display">
											{options.find((u) => u.id === formUserIds[0])?.name || `Usuario ID: ${formUserIds[0]}`}
										</div>
									)}
								</div>

								<div className="conf-form__group">
									<label className="conf-form__label">Líder *</label>
									<select className="conf-form__select" value={formLeaderId || 0} onChange={(e) => setFormLeaderId(parseInt(e.target.value))}>
										<option value={0}>Seleccionar líder...</option>
										{options.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
									</select>
								</div>

								{formError && <div className="conf-tab__error">{formError}</div>}
							</div>
						</div>
						<div className="modal__actions">
							<button className="conf-btn conf-btn--secondary" onClick={() => setShowModal(false)}>Cancelar</button>
							<button className="conf-btn conf-btn--primary" onClick={handleSave} disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
						</div>
					</div>
				</div>
			)}
		{createPortal(
			<AnimatePresence>
				{showDeleteModal && itemToDelete && (
					<motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
						<motion.div className="proyect-delete-modal" initial={{ scale: 0.94, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.94, opacity: 0, y: 10 }} transition={{ type: 'spring', stiffness: 280, damping: 22 }}>
							<div className="proyect-delete-modal__header">
								<span className="material-icons">report_problem</span>
								<h2>Eliminar relación</h2>
							</div>
							<div className="proyect-delete-modal__content">
								<p>Vas a eliminar:</p>
								<p className="proyect-delete-modal__project">
									{itemToDelete.user?.name ?? `ID: ${itemToDelete.userId}`} → {itemToDelete.leader?.name ?? `ID: ${itemToDelete.leaderId}`}
								</p>
								<div className="proyect-delete-modal__warning">
									<span className="material-icons">warning</span>
									<span>Esta acción es irreversible</span>
								</div>
							</div>
							<div className="proyect-delete-modal__actions">
								<button className="proyect-delete-btn proyect-delete-btn--cancel" onClick={() => setShowDeleteModal(false)} disabled={deleting}>Cancelar</button>
								<button className="proyect-delete-btn proyect-delete-btn--confirm" onClick={() => void confirmDelete()} disabled={deleting}>{deleting ? 'Eliminando...' : 'Eliminar'}</button>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>,
			document.body
		)}
		</div>
	)
}

export default UserLeadersTab
