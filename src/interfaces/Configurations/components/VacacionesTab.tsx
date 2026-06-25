import React, { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { vacacionesBDT } from '../services/VacacionesBDT'
import { timesheetUsersBDT } from '../services/TimesheetUsersBDT'
import type { UserVacationPeriodDto } from '../models/Vacaciones.m'
import type { UserOption } from '../models/TimesheetUser.m'
import { normalizeSearchText } from '../utils/stringUtils'
import { diffDays } from '../utils/dateUtils'
import { formatDate } from '../../base/utils/formatDate'
import { ClearFiltersButton } from '../../base/components/ClearFiltersButton/ClearFiltersButton'

const VacacionesTab: React.FC = () => {
	const [periods, setPeriods] = useState<UserVacationPeriodDto[]>([])
	const [users, setUsers] = useState<UserOption[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [formError, setFormError] = useState<string | null>(null)

	const [showModal, setShowModal] = useState(false)
	const [formUserIds, setFormUserIds] = useState<number[]>([])
	const [dateFrom, setDateFrom] = useState('')
	const [dateTo, setDateTo] = useState('')
	const [userSearchQuery, setUserSearchQuery] = useState('')
	const [saving, setSaving] = useState(false)
	const [search, setSearch] = useState('')
	const [showDeleteModal, setShowDeleteModal] = useState(false)
	const [itemToDelete, setItemToDelete] = useState<UserVacationPeriodDto | null>(null)
	const [deleting, setDeleting] = useState(false)

	const loadOptions = async () => {
		try {
			const optionsRes = await timesheetUsersBDT.getOptions()
			setUsers(optionsRes)
		} catch (err) {
			console.error('Error cargando opciones de usuarios', err)
		}
	}

	const loadPeriods = async (searchOverride?: string) => {
		setLoading(true)
		setError(null)
		const q = searchOverride !== undefined ? searchOverride : search
		try {
			const periodsRes = await vacacionesBDT.list({ search: q.trim() || undefined })
			setPeriods(periodsRes)
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'Error al cargar los datos')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => { void loadOptions(); void loadPeriods() }, []) // eslint-disable-line react-hooks/exhaustive-deps

	const filteredUsers = useMemo(() => {
		if (!userSearchQuery.trim()) return users
		const q = normalizeSearchText(userSearchQuery)
		return users.filter((u) => normalizeSearchText(u.name).includes(q))
	}, [users, userSearchQuery])

	const totalDaysComputed = useMemo(() => diffDays(dateFrom, dateTo), [dateFrom, dateTo])

	const handleAdd = () => {
		setFormUserIds([])
		setDateFrom('')
		setDateTo('')
		setUserSearchQuery('')
		setFormError(null)
		setShowModal(true)
	}

	const toggleUser = (userId: number) => {
		setFormUserIds((prev) => prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId])
	}

	const handleSelectAllUsers = () => {
		const all = filteredUsers.map((u) => u.id)
		const allSelected = all.every((id) => formUserIds.includes(id))
		setFormUserIds(allSelected ? [] : all)
	}

	const handleSave = async () => {
		if (formUserIds.length === 0) { setFormError('SeleccionÃ¡ al menos un usuario'); return }
		if (!dateFrom || !dateTo) { setFormError('CompletÃ¡ fecha desde y fecha hasta'); return }
		const days = diffDays(dateFrom, dateTo)
		if (days === null || days < 1) { setFormError('La fecha hasta debe ser mayor o igual que la fecha desde'); return }
		setFormError(null)
		setSaving(true)
		try {
			const entries = formUserIds.map((userId) => ({ userId, dateFrom, dateTo }))
			await vacacionesBDT.create(entries)
			await loadPeriods()
			setShowModal(false)
		} catch (err: unknown) {
			setFormError(err instanceof Error ? err.message : 'Error al guardar')
		} finally {
			setSaving(false)
		}
	}

	const requestDelete = (row: UserVacationPeriodDto) => {
		setItemToDelete(row)
		setShowDeleteModal(true)
	}

	const confirmDelete = async () => {
		if (!itemToDelete) return
		setDeleting(true)
		setError(null)
		try {
			await vacacionesBDT.remove(itemToDelete.id)
			setShowDeleteModal(false)
			setItemToDelete(null)
			await loadPeriods()
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
				<h2 className="conf-tab__title">Carga de Vacaciones</h2>
				<button className="proyect__add-btn" onClick={handleAdd}>
					<span className="material-icons">add</span>
					<span>Alta de registros</span>
				</button>
			</div>

			<p className="conf-tab__hint">
				AdministraciÃ³n de carga de vacaciones de usuarios
			</p>

			{error && <div className="conf-tab__error">{error}</div>}

			<div className="conf-tab__filters">
				<div className="conf-tab__filter-group conf-tab__filter-group--search">
					<span className="conf-tab__filter-label">Buscar</span>
					<div className="conf-tab__search-wrapper">
						<span className="material-icons conf-tab__search-icon">search</span>
						<input
							type="text"
							className="conf-tab__search-input"
							placeholder="Nombre de usuario..."
							value={search}
							onChange={(e) => { setSearch(e.target.value); void loadPeriods(e.target.value) }}
						/>
					</div>
				</div>
				<ClearFiltersButton
					active={search.trim() !== ''}
					onClear={() => { setSearch(''); void loadPeriods('') }}
					tooltip="Limpiar bÃºsqueda"
				/>
			</div>

			{loading && !periods.length ? (
				<div className="conf-tab__loading">Cargando...</div>
			) : (
				<div className="conf-tab__table-wrapper">
					<table className="conf-tab__table">
						<thead>
							<tr>
								<th>Usuario</th>
								<th>Fecha desde</th>
								<th>Fecha hasta</th>
								<th>Total dÃ­as</th>
								<th>Acciones</th>
							</tr>
						</thead>
						<tbody>
							{periods.length === 0 ? (
								<tr><td colSpan={5} style={{ textAlign: 'center', padding: 40 }}>
									{search.trim() ? 'No hay registros que coincidan con la bÃºsqueda.' : 'No hay registros de vacaciones. UsÃ¡ "Alta de registros" para cargar usuarios y un rango de fechas.'}
								</td></tr>
							) : (
								periods.map((p) => (
									<tr key={p.id}>
										<td>{p.userName ?? '-'}</td>
										<td>{formatDate(p.dateFrom)}</td>
										<td>{formatDate(p.dateTo)}</td>
										<td>{p.totalDays}</td>
										<td>
											<div className="conf-tab__row-actions">
												<button className="proyect-table__action proyect-table__action--delete" onClick={() => requestDelete(p)} data-tooltip="Eliminar">
													<span className="material-icons">delete</span>
												</button>
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			)}

			{showModal && (
				<div className="modal-overlay" onClick={() => setShowModal(false)}>
					<div className="modal conf-modal--md" onClick={(e) => e.stopPropagation()}>
						<div className="modal__header">
							<h2>Alta de registros de vacaciones</h2>
							<button onClick={() => setShowModal(false)}>Ã—</button>
						</div>
						<div className="modal__body">
							<div className="conf-form">
								<div className="conf-form__group">
									<div className="conf-form__select-header">
										<label className="conf-form__label">Usuarios *</label>
										{formUserIds.length > 0 && <span className="conf-modal__selected-count">{formUserIds.length} seleccionado(s)</span>}
									</div>
									<div className="conf-modal__search-container">
										<input type="text" placeholder="Buscar usuario..." value={userSearchQuery} onChange={(e) => setUserSearchQuery(e.target.value)} />
									</div>
									<div className="conf-modal__select-all-container">
										<button type="button" className="conf-modal__select-all-btn" onClick={handleSelectAllUsers}>
											{filteredUsers.every((u) => formUserIds.includes(u.id)) ? 'Deseleccionar todos' : 'Seleccionar todos'}
										</button>
									</div>
									<div className="conf-modal__users-grid">
										{filteredUsers.map((u) => (
											<label key={u.id} className={`conf-modal__user-checkbox${formUserIds.includes(u.id) ? ' checked' : ''}`}>
												<input type="checkbox" checked={formUserIds.includes(u.id)} onChange={() => toggleUser(u.id)} />
												<span className="conf-modal__user-name">{u.name}</span>
											</label>
										))}
									</div>
								</div>

								<div className="conf-form__row">
									<div className="conf-form__group">
										<label className="conf-form__label">Fecha desde *</label>
										<input type="date" className="conf-form__input" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
									</div>
									<div className="conf-form__group">
										<label className="conf-form__label">Fecha hasta *</label>
										<input type="date" className="conf-form__input" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
									</div>
								</div>

								<div className="conf-form__group">
									<label className="conf-form__label">Total de dÃ­as</label>
									<div className="conf-form__computed">{totalDaysComputed != null ? `${totalDaysComputed} dÃ­as` : '-'}</div>
								</div>

								{formError && <div className="conf-tab__error">{formError}</div>}
							</div>
						</div>
						<div className="modal__actions">
							<button className="conf-btn conf-btn--secondary" onClick={() => setShowModal(false)}>Cancelar</button>
							<button className="conf-btn conf-btn--primary" onClick={handleSave} disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
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
								<h2>Eliminar vacaciones</h2>
							</div>
							<div className="proyect-delete-modal__content">
								<p>Vas a eliminar:</p>
								<p className="proyect-delete-modal__project">{itemToDelete.userName ?? 'Usuario'} â€” {formatDate(itemToDelete.dateFrom)} al {formatDate(itemToDelete.dateTo)}</p>
								<div className="proyect-delete-modal__warning">
									<span className="material-icons">warning</span>
									<span>Esta acciÃ³n es irreversible</span>
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

export default VacacionesTab
