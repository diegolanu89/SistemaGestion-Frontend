import React, { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { clockifyUsersBDT } from '../services/ClockifyUsersBDT'
import { workingDaysCalendarBDT } from '../services/WorkingDaysCalendarBDT'
import type { ClockifyUserDto } from '../models/ClockifyUser.m'

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const ClockifyUsersTab: React.FC = () => {
	const [users, setUsers] = useState<ClockifyUserDto[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [search, setSearch] = useState('')
	const [showModal, setShowModal] = useState(false)
	const [editingId, setEditingId] = useState<number | null>(null)
	const [saving, setSaving] = useState(false)
	const [formErrors, setFormErrors] = useState<string[]>([])

	const [formName, setFormName] = useState('')
	const [formEmail, setFormEmail] = useState('')
	const [formClockifyId, setFormClockifyId] = useState('')
	const [formActive, setFormActive] = useState(true)
	const [formMonthHours, setFormMonthHours] = useState<string>('160')
	const [formRole, setFormRole] = useState<string>('')

	const [syncing, setSyncing] = useState(false)
	const [syncMessage, setSyncMessage] = useState<string | null>(null)

	const [showDeleteModal, setShowDeleteModal] = useState(false)
	const [userToDelete, setUserToDelete] = useState<ClockifyUserDto | null>(null)
	const [deleting, setDeleting] = useState(false)

	const [capacityUser, setCapacityUser] = useState<ClockifyUserDto | null>(null)
	const [showCapacityModal, setShowCapacityModal] = useState(false)
	const [capacityHoursByMonth, setCapacityHoursByMonth] = useState<Record<string, string>>({})
	const [capacityLimitsByMonth, setCapacityLimitsByMonth] = useState<Record<string, number>>({})
	const [capacityError, setCapacityError] = useState<string | null>(null)

	const MONTH_RANGE = useMemo(() => {
		const months: Array<{ monthKey: string; monthLabel: string }> = []
		const today = new Date()
		for (let i = 0; i <= 11; i++) {
			const date = new Date(today.getFullYear(), today.getMonth() + i, 1)
			const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
			const monthLabel = date.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })
			months.push({ monthKey, monthLabel: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1) })
		}
		return months
	}, [])

	const loadData = async () => {
		setLoading(true)
		setError(null)
		try {
			const { users: data } = await clockifyUsersBDT.list({ search: search.trim() || undefined, per_page: 500 })
			setUsers(data)
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'Error al cargar los usuarios clocky')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => { loadData() }, []) // eslint-disable-line react-hooks/exhaustive-deps

	const handleSync = async () => {
		setSyncing(true)
		setSyncMessage(null)
		setError(null)
		try {
			await clockifyUsersBDT.sync()
			await loadData()
			setSyncMessage('Sincronización completada')
			setTimeout(() => setSyncMessage(null), 4000)
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'Error al sincronizar usuarios clocky')
		} finally {
			setSyncing(false)
		}
	}

	const openAdd = () => {
		setEditingId(null)
		setFormName('')
		setFormEmail('')
		setFormClockifyId('')
		setFormActive(true)
		setFormMonthHours('160')
		setFormRole('')
		setFormErrors([])
		setShowModal(true)
	}

	const openEdit = (u: ClockifyUserDto) => {
		setEditingId(u.id)
		setFormName(u.name)
		setFormEmail(u.email ?? '')
		setFormClockifyId(u.clockifyUserId ?? '')
		setFormActive(u.active)
		setFormMonthHours(u.defaultMonthHours != null ? String(u.defaultMonthHours) : '')
		setFormRole(u.role ?? '')
		setFormErrors([])
		setShowModal(true)
	}

	const validate = (): string[] => {
		const errors: string[] = []
		if (!formName.trim()) errors.push('El nombre es obligatorio')
		if (!formEmail.trim()) errors.push('El email es obligatorio')
		else if (!isValidEmail(formEmail.trim())) errors.push('El email no tiene un formato válido')
		const monthHoursNum = formMonthHours.trim() === '' ? null : Number(formMonthHours)
		if (monthHoursNum !== null && (isNaN(monthHoursNum) || monthHoursNum < 0)) {
			errors.push('Las horas por mes deben ser un número válido (>= 0)')
		}
		return errors
	}

	const handleSave = async () => {
		const errors = validate()
		if (errors.length > 0) { setFormErrors(errors); return }
		setFormErrors([])

		const monthHours = formMonthHours.trim() === '' ? null : Number(formMonthHours)
		setSaving(true)
		setError(null)
		try {
			const payload = {
				name: formName.trim(),
				email: formEmail.trim() || null,
				clockifyUserId: formClockifyId.trim() || null,
				active: formActive,
				role: formRole.trim() || null,
				defaultMonthHours: monthHours,
			}
			if (editingId) {
				await clockifyUsersBDT.update(editingId, payload)
			} else {
				await clockifyUsersBDT.create(payload)
			}
			setShowModal(false)
			await loadData()
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'Error al guardar el usuario clocky')
		} finally {
			setSaving(false)
		}
	}

	const requestDelete = (u: ClockifyUserDto) => {
		setUserToDelete(u)
		setShowDeleteModal(true)
	}

	const confirmDelete = async () => {
		if (!userToDelete) return
		setDeleting(true)
		setError(null)
		try {
			await clockifyUsersBDT.remove(userToDelete.id)
			setShowDeleteModal(false)
			setUserToDelete(null)
			await loadData()
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'Error al eliminar')
			setShowDeleteModal(false)
		} finally {
			setDeleting(false)
		}
	}

	const openCapacityModal = async (u: ClockifyUserDto) => {
		setCapacityUser(u)
		setCapacityHoursByMonth({})
		setCapacityLimitsByMonth({})
		setCapacityError(null)
		setShowCapacityModal(true)

		try {
			const capacities = await clockifyUsersBDT.listCapacities(u.id)
			const map: Record<string, string> = {}
			capacities.forEach((c) => { map[c.monthKey] = String(c.hours ?? 0) })

			const years = Array.from(new Set(MONTH_RANGE.map((m) => Number(m.monthKey.split('-')[0])).filter((y) => !isNaN(y))))
			const limits: Record<string, number> = {}
			for (const year of years) {
				try {
					const items = await workingDaysCalendarBDT.list({ year, per_page: 200 })
					items.forEach((item) => {
						const key = `${item.year}-${String(item.month).padStart(2, '0')}`
						limits[key] = Number(item.hoursMonth ?? item.workingDays * 8)
					})
				} catch { /* no cargamos límites de ese año */ }
			}
			setCapacityLimitsByMonth(limits)

			const nextMap: Record<string, string> = { ...map }
			MONTH_RANGE.forEach(({ monthKey }) => {
				if (!nextMap[monthKey]) {
					const limit = limits[monthKey]
					nextMap[monthKey] = limit !== undefined ? String(limit) : '160'
				}
			})
			setCapacityHoursByMonth(nextMap)
		} catch (err) {
			console.error('Error cargando capacidades del usuario', err)
		}
	}

	const handleSaveCapacities = async () => {
		if (!capacityUser) return
		for (const { monthKey } of MONTH_RANGE) {
			const val = capacityHoursByMonth[monthKey] ?? ''
			if (!val.trim()) continue
			const hours = parseFloat(val)
			if (isNaN(hours) || hours < 0) {
				setCapacityError('Las horas deben ser un número válido (>= 0) en todos los meses.')
				return
			}
			const limit = capacityLimitsByMonth[monthKey]
			if (limit !== undefined && hours > limit + 0.0001) {
				setCapacityError(`Las horas de capacidad en ${monthKey} (${hours.toFixed(2)} h) exceden las horas laborales del mes (${limit.toFixed(2)} h).`)
				return
			}
		}

		const entries = MONTH_RANGE.flatMap(({ monthKey, monthLabel }) => {
			const hours = parseFloat(capacityHoursByMonth[monthKey] ?? '') || 0
			return hours > 0 ? [{ monthKey, monthLabel, hours }] : []
		})

		try {
			await clockifyUsersBDT.saveCapacities(capacityUser.id, entries)
			setShowCapacityModal(false)
			setCapacityError(null)
		} catch (err: unknown) {
			setCapacityError(err instanceof Error ? err.message : 'Error al guardar las horas por mes del usuario')
		}
	}

	return (
		<div className="conf-tab">
			<div className="conf-tab__header">
				<h2 className="conf-tab__title">Usuarios clocky</h2>
				<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
					{syncMessage && (
						<span style={{ fontSize: 13, color: 'var(--color-success)', fontWeight: 600 }}>
							{syncMessage}
						</span>
					)}
					<button className="proyect__add-btn" onClick={handleSync} disabled={syncing}>
						<span className="material-icons">sync</span>
						<span>{syncing ? 'Sincronizando...' : 'Sincronizar usuarios clocky'}</span>
					</button>
					<button className="proyect__add-btn" onClick={openAdd}>
						<span className="material-icons">add</span>
						<span>Nuevo usuario clocky</span>
					</button>
				</div>
			</div>

			<p className="conf-tab__hint">
				Usuarios que participan en el Dashboard de Horas (Clockify + cargados manualmente). Definí la función y las horas de trabajo por mes de cada usuario.
			</p>

			{error && <div className="conf-tab__error">{error}</div>}

			<form onSubmit={(e) => { e.preventDefault(); loadData() }} className="conf-tab__filters">
				<input type="text" placeholder="Buscar por nombre o email..." value={search} onChange={(e) => setSearch(e.target.value)} />
				<button type="submit" className="conf-btn conf-btn--secondary" disabled={loading}>Buscar</button>
			</form>

			{loading && !users.length ? (
				<div className="conf-tab__loading">Cargando...</div>
			) : (
				<div className="conf-tab__table-wrapper">
					<table className="conf-tab__table">
						<thead>
							<tr>
								<th>Nombre</th>
								<th>Email</th>
								<th>Origen</th>
								<th>Función</th>
								<th>Horas estándar/mes</th>
								<th>Estado</th>
								<th>Acciones</th>
							</tr>
						</thead>
						<tbody>
							{users.length === 0 ? (
								<tr><td colSpan={7} style={{ textAlign: 'center', padding: 32 }}>No hay usuarios clocky. Usá &quot;Nuevo usuario clocky&quot; para crear uno.</td></tr>
							) : (
								users.map((u) => (
									<tr key={u.id}>
										<td>{u.name}</td>
										<td>{u.email ?? '-'}</td>
										<td>{u.clockifyUserId ? 'Clockify' : 'Manual'}</td>
										<td>{u.role ?? '-'}</td>
										<td>{u.defaultMonthHours != null ? `${Number(u.defaultMonthHours).toFixed(1)} h` : '-'}</td>
										<td>{u.active ? 'Activo' : 'Inactivo'}</td>
										<td>
											<div className="conf-tab__row-actions">
												<button className="proyect-table__action proyect-table__action--edit" onClick={() => openEdit(u)} data-tooltip="Editar">
													<span className="material-icons">edit</span>
												</button>
												<button className="proyect-table__action proyect-table__action--delete" onClick={() => requestDelete(u)} data-tooltip="Eliminar">
													<span className="material-icons">delete</span>
												</button>
												<button className="conf-btn conf-btn--secondary" onClick={() => openCapacityModal(u)}>Horas por mes</button>
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			)}

			{/* ── MODAL CREAR / EDITAR ── */}
			{showModal && (
				<div className="modal-overlay" onClick={() => setShowModal(false)}>
					<div className="modal conf-modal--sm" onClick={(e) => e.stopPropagation()}>
						<div className="modal__header">
							<h2>{editingId ? 'Editar usuario clocky' : 'Nuevo usuario clocky'}</h2>
							<button onClick={() => setShowModal(false)}>×</button>
						</div>
						<div className="modal__body">
							<div className="conf-form">
								<div className="conf-form__group">
									<label className="conf-form__label">Nombre *</label>
									<input type="text" className="conf-form__input" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Nombre del recurso" />
								</div>
								<div className="conf-form__group">
									<label className="conf-form__label">Email *</label>
									<input type="email" className="conf-form__input" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="usuario@ejemplo.com" />
								</div>
								<div className="conf-form__group">
									<label className="conf-form__label">Clockify user ID (opcional)</label>
									<input type="text" className="conf-form__input" value={formClockifyId} onChange={(e) => setFormClockifyId(e.target.value)} placeholder="ID original de Clockify (dejar vacío si es manual)" />
								</div>
								<div className="conf-form__group">
									<label className="conf-form__label">Horas estándar que trabaja por mes</label>
									<input type="number" min={0} step={0.5} className="conf-form__input" value={formMonthHours} onChange={(e) => setFormMonthHours(e.target.value)} placeholder="Ej: 160" />
								</div>
								<div className="conf-form__group">
									<label className="conf-form__label">Función</label>
									<select className="conf-form__select" value={formRole} onChange={(e) => setFormRole(e.target.value)}>
										<option value="">Sin función</option>
										<option value="Líder">Líder</option>
										<option value="Analista">Analista</option>
										<option value="Desarrollador">Desarrollador</option>
										<option value="QA">QA</option>
									</select>
								</div>
								<div className="conf-form__group">
									<label className="conf-form__checkbox-label">
										<input type="checkbox" checked={formActive} onChange={(e) => setFormActive(e.target.checked)} />
										Usuario activo
									</label>
								</div>

								{formErrors.length > 0 && (
									<ul className="proyect-create-errors">
										{formErrors.map((err, i) => (
											<li key={i} className="proyect-create-error-item">
												<span className="material-icons">error_outline</span>
												{err}
											</li>
										))}
									</ul>
								)}

								{error && <div className="conf-tab__error">{error}</div>}
							</div>
						</div>
						<div className="modal__actions">
							<button className="conf-btn conf-btn--secondary" onClick={() => setShowModal(false)}>Cancelar</button>
							<button className="conf-btn conf-btn--primary" onClick={handleSave} disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
						</div>
					</div>
				</div>
			)}

			{/* ── MODAL CAPACIDAD MENSUAL ── */}
			{showCapacityModal && capacityUser && (
				<div className="modal-overlay" onClick={() => setShowCapacityModal(false)}>
					<div className="modal" onClick={(e) => e.stopPropagation()}>
						<div className="modal__header">
							<h2>Horas por mes — {capacityUser.name}</h2>
							<button onClick={() => setShowCapacityModal(false)}>×</button>
						</div>
						<div className="modal__body">
							<p className="conf-tab__hint" style={{ marginBottom: 12 }}>
								Definí la capacidad mensual (horas) de este usuario por mes calendario.
							</p>
							{capacityError && <div className="conf-tab__error" style={{ marginBottom: 12 }}>{capacityError}</div>}
							<div className="conf-matrix">
								<table className="conf-matrix__table">
									<thead>
										<tr>
											<th className="conf-matrix__user-col">Mes</th>
											{MONTH_RANGE.map((m) => (
												<th key={m.monthKey} className="conf-matrix__month-header">{m.monthLabel}</th>
											))}
										</tr>
									</thead>
									<tbody>
										<tr>
											<td className="conf-matrix__user-cell">Capacidad (horas)</td>
											{MONTH_RANGE.map((m) => (
												<td key={m.monthKey} className="conf-matrix__cell">
													<input
														type="number"
														min={0}
														step={0.5}
														value={capacityHoursByMonth[m.monthKey] ?? ''}
														onChange={(e) => setCapacityHoursByMonth((prev) => ({ ...prev, [m.monthKey]: e.target.value }))}
													/>
												</td>
											))}
										</tr>
									</tbody>
								</table>
							</div>
						</div>
						<div className="modal__actions">
							<button className="conf-btn conf-btn--secondary" onClick={() => setShowCapacityModal(false)}>Cancelar</button>
							<button className="conf-btn conf-btn--primary" onClick={handleSaveCapacities}>Guardar horas por mes</button>
						</div>
					</div>
				</div>
			)}

			{/* ── MODAL CONFIRMAR ELIMINACIÓN ── */}
			{createPortal(
				<AnimatePresence>
					{showDeleteModal && userToDelete && (
						<motion.div
							className="modal-overlay"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
						>
							<motion.div
								className="proyect-delete-modal"
								initial={{ scale: 0.94, opacity: 0, y: 10 }}
								animate={{ scale: 1, opacity: 1, y: 0 }}
								exit={{ scale: 0.94, opacity: 0, y: 10 }}
								transition={{ type: 'spring', stiffness: 280, damping: 22 }}
							>
								<div className="proyect-delete-modal__header">
									<span className="material-icons">report_problem</span>
									<h2>Eliminar usuario clocky</h2>
								</div>
								<div className="proyect-delete-modal__content">
									<p>Vas a eliminar:</p>
									<p className="proyect-delete-modal__project">{userToDelete.name}</p>
									<div className="proyect-delete-modal__warning">
										<span className="material-icons">warning</span>
										<span>Esta acción es irreversible</span>
									</div>
								</div>
								<div className="proyect-delete-modal__actions">
									<button
										className="proyect-delete-btn proyect-delete-btn--cancel"
										onClick={() => setShowDeleteModal(false)}
										disabled={deleting}
									>
										Cancelar
									</button>
									<button
										className="proyect-delete-btn proyect-delete-btn--confirm"
										onClick={() => void confirmDelete()}
										disabled={deleting}
									>
										{deleting ? 'Eliminando...' : 'Eliminar'}
									</button>
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

export default ClockifyUsersTab
