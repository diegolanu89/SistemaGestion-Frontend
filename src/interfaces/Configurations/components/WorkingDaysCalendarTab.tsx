import React, { useEffect, useMemo, useState } from 'react'
import { workingDaysCalendarBDT } from '../services/WorkingDaysCalendarBDT'
import type { WorkingDaysCalendarDto } from '../models/WorkingDaysCalendar.m'

type FormState = Partial<WorkingDaysCalendarDto>

const WorkingDaysCalendarTab: React.FC = () => {
	const [data, setData] = useState<WorkingDaysCalendarDto[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const [showModal, setShowModal] = useState(false)
	const [editingId, setEditingId] = useState<number | null>(null)
	const [formData, setFormData] = useState<FormState>({
		monthKey: '',
		year: new Date().getFullYear(),
		month: new Date().getMonth() + 1,
		totalDays: 0,
		workingDays: 0,
		holidayDays: 0,
		holidaysList: null,
		notes: null,
	})

	const [filterMonth, setFilterMonth] = useState('')
	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = 10

	const loadData = async () => {
		setLoading(true)
		setError(null)
		try {
			const items = await workingDaysCalendarBDT.list({ per_page: 1000 })
			setData(items)
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'Error al cargar los datos')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => { loadData() }, [])

	const filteredData = useMemo(() => {
		if (!filterMonth) return data
		return data.filter((item) => item.monthKey.includes(filterMonth))
	}, [data, filterMonth])

	const sortedData = useMemo(() => {
		const now = new Date()
		const currentKey = now.getFullYear() * 12 + (now.getMonth() + 1)
		return [...filteredData].sort((a, b) => {
			const keyA = a.year * 12 + a.month
			const keyB = b.year * 12 + b.month
			const aFuture = keyA >= currentKey
			const bFuture = keyB >= currentKey
			if (aFuture && !bFuture) return -1
			if (!aFuture && bFuture) return 1
			return keyA - keyB
		})
	}, [filteredData])

	const paginatedData = useMemo(() => {
		const start = (currentPage - 1) * itemsPerPage
		return sortedData.slice(start, start + itemsPerPage)
	}, [sortedData, currentPage])

	const totalPages = Math.ceil(sortedData.length / itemsPerPage)

	const handleCreate = () => {
		setEditingId(null)
		setFormData({ monthKey: '', year: new Date().getFullYear(), month: new Date().getMonth() + 1, totalDays: 0, workingDays: 0, holidayDays: 0, holidaysList: null, notes: null })
		setShowModal(true)
	}

	const handleEdit = (item: WorkingDaysCalendarDto) => {
		setEditingId(item.id || null)
		setFormData({ monthKey: item.monthKey, year: item.year, month: item.month, totalDays: item.totalDays, workingDays: item.workingDays, holidayDays: item.holidayDays || 0, holidaysList: item.holidaysList || null, notes: item.notes || null })
		setShowModal(true)
	}

	const handleSave = async () => {
		if (!formData.monthKey || !formData.year || !formData.month) { setError('monthKey, año y mes son obligatorios'); return }
		setLoading(true)
		setError(null)
		try {
			if (editingId) {
				await workingDaysCalendarBDT.update(editingId, {
					workingDays: formData.workingDays,
					holidayDays: formData.holidayDays,
					holidaysList: formData.holidaysList,
					notes: formData.notes,
				})
			} else {
				await workingDaysCalendarBDT.create({
					monthKey: formData.monthKey!,
					monthLabel: `${formData.year}-${String(formData.month).padStart(2, '0')}`,
					year: formData.year!,
					month: formData.month!,
					totalDays: formData.totalDays ?? 0,
					workingDays: formData.workingDays ?? 0,
					holidayDays: formData.holidayDays,
					holidaysList: formData.holidaysList,
					notes: formData.notes,
				})
			}
			setShowModal(false)
			loadData()
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'Error al guardar')
		} finally {
			setLoading(false)
		}
	}

	const handleDelete = async (id: number) => {
		if (!confirm('¿Estás seguro de eliminar este calendario?')) return
		setLoading(true)
		setError(null)
		try {
			await workingDaysCalendarBDT.remove(id)
			loadData()
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'Error al eliminar')
		} finally {
			setLoading(false)
		}
	}

	const set = (patch: Partial<FormState>) => setFormData((prev) => ({ ...prev, ...patch }))

	return (
		<div className="conf-tab">
			<div className="conf-tab__header">
				<h2 className="conf-tab__title">Calendario de Días Laborales</h2>
				<button className="proyect__add-btn" onClick={handleCreate}>
					<span className="material-icons">add</span>
					<span>Nuevo calendario</span>
				</button>
			</div>

			{error && <div className="conf-tab__error">{error}</div>}

			<div className="conf-tab__filters">
				<input type="text" placeholder="Filtrar por mes (ej: 2025-03)" value={filterMonth} onChange={(e) => { setFilterMonth(e.target.value); setCurrentPage(1) }} />
			</div>

			{loading && !data.length ? (
				<div className="conf-tab__loading">Cargando...</div>
			) : (
				<>
					<div className="conf-tab__table-wrapper">
						<table className="conf-tab__table">
							<thead>
								<tr>
									<th>Mes key</th>
									<th>Año</th>
									<th>Mes (1-12)</th>
									<th>Total Días</th>
									<th>Días Laborales</th>
									<th>Horas Mes</th>
									<th>Feriados</th>
									<th>Acciones</th>
								</tr>
							</thead>
							<tbody>
								{paginatedData.map((item) => (
									<tr key={item.id}>
										<td>{item.monthKey}</td>
										<td>{item.year}</td>
										<td>{item.month}</td>
										<td>{item.totalDays}</td>
										<td>{item.workingDays}</td>
										<td>{item.hoursMonth ?? 0}</td>
										<td>{item.holidayDays || 0}</td>
										<td>
											<div className="conf-tab__row-actions">
												<button className="proyect-table__action proyect-table__action--edit" onClick={() => handleEdit(item)} data-tooltip="Editar">
													<span className="material-icons">edit</span>
												</button>
												<button className="proyect-table__action proyect-table__action--delete" onClick={() => item.id && handleDelete(item.id)} data-tooltip="Eliminar">
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
					<div className="modal conf-modal--sm" onClick={(e) => e.stopPropagation()}>
						<div className="modal__header">
							<h2>{editingId ? 'Editar' : 'Nuevo'} calendario</h2>
							<button onClick={() => setShowModal(false)}>×</button>
						</div>
						<div className="modal__body">
							<div className="conf-form">
								<div className="conf-form__group">
									<label className="conf-form__label">Month key (ej: 2025-04) *</label>
									<input type="text" className="conf-form__input" value={formData.monthKey || ''} onChange={(e) => set({ monthKey: e.target.value })} placeholder="2025-04" disabled={!!editingId} />
								</div>

								<div className="conf-form__row">
									<div className="conf-form__group">
										<label className="conf-form__label">Año *</label>
										<input type="number" className="conf-form__input" value={formData.year || ''} onChange={(e) => set({ year: parseInt(e.target.value) })} min="2000" max="2100" disabled={!!editingId} />
									</div>
									<div className="conf-form__group">
										<label className="conf-form__label">Mes (1-12) *</label>
										<input type="number" className="conf-form__input" value={formData.month || ''} onChange={(e) => set({ month: parseInt(e.target.value) })} min="1" max="12" disabled={!!editingId} />
									</div>
								</div>

								<div className="conf-form__row">
									<div className="conf-form__group">
										<label className="conf-form__label">Total Días *</label>
										<input type="number" className="conf-form__input" value={formData.totalDays || 0} onChange={(e) => set({ totalDays: parseInt(e.target.value) })} min="1" max="31" disabled={!!editingId} />
									</div>
									<div className="conf-form__group">
										<label className="conf-form__label">Días Laborales *</label>
										<input type="number" className="conf-form__input" value={formData.workingDays || 0} onChange={(e) => set({ workingDays: parseInt(e.target.value) })} min="0" />
									</div>
								</div>

								<div className="conf-form__row">
									<div className="conf-form__group">
										<label className="conf-form__label">Horas del mes (calculado)</label>
										<div className="conf-form__computed">{(formData.workingDays ?? 0) * 8} h</div>
									</div>
									<div className="conf-form__group">
										<label className="conf-form__label">Feriados</label>
										<input type="number" className="conf-form__input" value={formData.holidayDays || 0} onChange={(e) => set({ holidayDays: parseInt(e.target.value) })} min="0" />
									</div>
								</div>

								<div className="conf-form__group">
									<label className="conf-form__label">Notas</label>
									<textarea className="conf-form__textarea" value={formData.notes || ''} onChange={(e) => set({ notes: e.target.value || null })} rows={3} />
								</div>

								{error && <div className="conf-tab__error">{error}</div>}
							</div>
						</div>
						<div className="modal__actions">
							<button className="conf-btn conf-btn--secondary" onClick={() => setShowModal(false)}>Cancelar</button>
							<button className="conf-btn conf-btn--primary" onClick={handleSave} disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default WorkingDaysCalendarTab
