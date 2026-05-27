import React, { useEffect, useMemo, useState } from 'react'
import { vacacionesBDT } from '../services/VacacionesBDT'
import { clockifyUsersBDT } from '../services/ClockifyUsersBDT'
import type { UserVacationPeriodDto } from '../models/Vacaciones.m'
import type { UserOption } from '../models/ClockifyUser.m'
import { normalizeSearchText } from '../utils/stringUtils'
import { diffDays } from '../utils/dateUtils'

const VacacionesTab: React.FC = () => {
	const [periods, setPeriods] = useState<UserVacationPeriodDto[]>([])
	const [users, setUsers] = useState<UserOption[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const [showModal, setShowModal] = useState(false)
	const [formUserIds, setFormUserIds] = useState<number[]>([])
	const [dateFrom, setDateFrom] = useState('')
	const [dateTo, setDateTo] = useState('')
	const [userSearchQuery, setUserSearchQuery] = useState('')
	const [saving, setSaving] = useState(false)

	const loadData = async () => {
		setLoading(true)
		setError(null)
		try {
			const [periodsRes, optionsRes] = await Promise.all([
				vacacionesBDT.list(),
				clockifyUsersBDT.getOptions(),
			])
			setPeriods(periodsRes)
			setUsers(optionsRes)
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'Error al cargar los datos')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => { loadData() }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
		if (formUserIds.length === 0) { setError('Seleccioná al menos un usuario'); return }
		if (!dateFrom || !dateTo) { setError('Completá fecha desde y fecha hasta'); return }
		const days = diffDays(dateFrom, dateTo)
		if (days === null || days < 1) { setError('La fecha hasta debe ser mayor o igual que la fecha desde'); return }
		setError(null)
		setSaving(true)
		try {
			const entries = formUserIds.map((userId) => ({ userId, dateFrom, dateTo }))
			await vacacionesBDT.create(entries)
			await loadData()
			setShowModal(false)
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'Error al guardar')
		} finally {
			setSaving(false)
		}
	}

	const handleDelete = async (row: UserVacationPeriodDto) => {
		if (!window.confirm(`¿Eliminar vacaciones de ${row.userName ?? 'usuario'} (${row.dateFrom} a ${row.dateTo})?`)) return
		setError(null)
		try {
			await vacacionesBDT.remove(row.id)
			await loadData()
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'Error al eliminar')
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
				Administración de carga de vacaciones de usuarios
			</p>

			{error && <div className="conf-tab__error">{error}</div>}

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
								<th>Total días</th>
								<th>Acciones</th>
							</tr>
						</thead>
						<tbody>
							{periods.length === 0 ? (
								<tr><td colSpan={5} style={{ textAlign: 'center', padding: 40 }}>No hay registros de vacaciones. Usá &quot;Alta de registros&quot; para cargar usuarios y un rango de fechas.</td></tr>
							) : (
								periods.map((p) => (
									<tr key={p.id}>
										<td>{p.userName ?? '-'}</td>
										<td>{p.dateFrom}</td>
										<td>{p.dateTo}</td>
										<td>{p.totalDays}</td>
										<td>
											<div className="conf-tab__row-actions">
												<button className="proyect-table__action proyect-table__action--delete" onClick={() => handleDelete(p)} data-tooltip="Eliminar">
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
							<button onClick={() => setShowModal(false)}>×</button>
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
									<label className="conf-form__label">Total de días</label>
									<div className="conf-form__computed">{totalDaysComputed != null ? `${totalDaysComputed} días` : '-'}</div>
								</div>

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
		</div>
	)
}

export default VacacionesTab
