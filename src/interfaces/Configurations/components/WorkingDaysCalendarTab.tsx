import React, { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { workingDaysCalendarBDT } from '../services/WorkingDaysCalendarBDT'
import type { WorkingDaysCalendarDto } from '../models/WorkingDaysCalendar.m'
import { ClearFiltersButton } from '../../base/components/ClearFiltersButton/ClearFiltersButton'

const MONTH_NAMES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

type FormState = Partial<WorkingDaysCalendarDto>

const WorkingDaysCalendarTab: React.FC = () => {
	const [data, setData] = useState<WorkingDaysCalendarDto[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [formError, setFormError] = useState<string | null>(null)
	const [showDeleteModal, setShowDeleteModal] = useState(false)
	const [itemToDelete, setItemToDelete] = useState<WorkingDaysCalendarDto | null>(null)
	const [deleting, setDeleting] = useState(false)

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

	const defaultYearFrom = new Date().getFullYear()

	const [filterMonth, setFilterMonth] = useState('')
	const [filterYearFrom, setFilterYearFrom] = useState<number | ''>(defaultYearFrom)
	const [filterMonthFrom, setFilterMonthFrom] = useState<number | ''>('')
	const [filterYearTo, setFilterYearTo] = useState<number | ''>('')
	const [filterMonthTo, setFilterMonthTo] = useState<number | ''>('')
	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = 12

	const availableYears = useMemo(() => {
		const years = new Set(data.map((d) => d.year))
		return Array.from(years).sort((a, b) => a - b)
	}, [data])

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

	useEffect(() => { void loadData() }, []) // eslint-disable-line react-hooks/exhaustive-deps

	const filteredData = useMemo(() => {
		return data.filter((item) => {
			if (filterMonth) {
				const q = filterMonth.toLowerCase()
				if (!item.monthKey.toLowerCase().includes(q) && !(item.monthLabel ?? '').toLowerCase().includes(q)) return false
			}
			const itemKey = item.year * 12 + item.month
			if (filterYearFrom !== '' || filterMonthFrom !== '') {
				const fromKey = (filterYearFrom !== '' ? filterYearFrom : 0) * 12 + (filterMonthFrom !== '' ? filterMonthFrom : 1)
				if (itemKey < fromKey) return false
			}
			if (filterYearTo !== '' || filterMonthTo !== '') {
				const toKey = (filterYearTo !== '' ? filterYearTo : 9999) * 12 + (filterMonthTo !== '' ? filterMonthTo : 12)
				if (itemKey > toKey) return false
			}
			return true
		})
	}, [data, filterMonth, filterYearFrom, filterMonthFrom, filterYearTo, filterMonthTo])

	const currentMonthKey = useMemo(() => {
		const now = new Date()
		return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
	}, [])

	const sortedData = useMemo(() => {
		return [...filteredData].sort((a, b) => a.year * 12 + a.month - (b.year * 12 + b.month))
	}, [filteredData])

	const paginatedData = useMemo(() => {
		const start = (currentPage - 1) * itemsPerPage
		return sortedData.slice(start, start + itemsPerPage)
	}, [sortedData, currentPage])

	const totalPages = Math.ceil(sortedData.length / itemsPerPage)

	const [formHolidays, setFormHolidays] = useState<string[]>([])

	const parseHolidays = (raw: string | null | undefined): string[] => {
		if (!raw) return []
		try {
			const parsed = JSON.parse(raw)
			return Array.isArray(parsed) ? parsed : []
		} catch {
			return []
		}
	}

	const handleCreate = () => {
		setEditingId(null)
		setFormData({
			monthKey: '',
			year: undefined,
			month: undefined,
			totalDays: undefined,
			workingDays: undefined,
			holidayDays: undefined,
			holidaysList: null,
			notes: null,
		})
		setFormHolidays([])
		setFormError(null)
		setShowModal(true)
	}

	const handleEdit = (item: WorkingDaysCalendarDto) => {
		setEditingId(item.id || null)
		setFormData({
			monthKey: item.monthKey,
			year: item.year,
			month: item.month,
			totalDays: item.totalDays,
			workingDays: item.workingDays,
			holidayDays: item.holidayDays || 0,
			holidaysList: item.holidaysList || null,
			notes: item.notes || null,
		})
		setFormHolidays(parseHolidays(item.holidaysList))
		setFormError(null)
		setShowModal(true)
	}

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)
		setFormError(null)
		try {
			const holidaysArr = formHolidays.filter(Boolean)
			const holidaysList = holidaysArr.length > 0 ? JSON.stringify(holidaysArr) : null

			if (editingId) {
				await workingDaysCalendarBDT.update(editingId, {
					workingDays: formData.workingDays,
					holidayDays: formData.holidayDays,
					holidaysList,
					notes: formData.notes,
				})
			} else {
				await workingDaysCalendarBDT.create({
					monthKey: formData.monthKey!,
					monthLabel: `${MONTH_NAMES[formData.month! - 1]} ${formData.year}`,
					year: formData.year!,
					month: formData.month!,
					totalDays: new Date(formData.year!, formData.month!, 0).getDate(),
					workingDays: formData.workingDays ?? 0,
					holidayDays: formData.holidayDays,
					holidaysList,
					notes: formData.notes,
				})
			}
			setShowModal(false)
			void loadData()
		} catch (err: unknown) {
			setFormError(err instanceof Error ? err.message : 'Error al guardar')
		} finally {
			setLoading(false)
		}
	}

	const requestDelete = (item: WorkingDaysCalendarDto) => {
		setItemToDelete(item)
		setShowDeleteModal(true)
	}

	const confirmDelete = async () => {
		if (!itemToDelete?.id) return
		setDeleting(true)
		setError(null)
		try {
			await workingDaysCalendarBDT.remove(itemToDelete.id)
			setShowDeleteModal(false)
			setItemToDelete(null)
			void loadData()
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'Error al eliminar')
			setShowDeleteModal(false)
		} finally {
			setDeleting(false)
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

			<p className="conf-tab__hint">
				Configurá las características de cada mes: días laborales, feriados y horas. Base para el cálculo de capacidad mensual en los reportes de horas.
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
							placeholder="Mes key o nombre (ej: 2025-03 o Mayo)"
							value={filterMonth}
							onChange={(e) => { setFilterMonth(e.target.value); setCurrentPage(1) }}
						/>
					</div>
				</div>
				<div className="conf-tab__filter-group">
					<span className="conf-tab__filter-label">Año desde</span>
					<select
						className="conf-tab__filter-select"
						value={filterYearFrom}
						onChange={(e) => { setFilterYearFrom(e.target.value ? Number(e.target.value) : ''); setCurrentPage(1) }}
					>
						<option value="">Todos</option>
						{availableYears.map((y) => <option key={y} value={y}>{y}</option>)}
					</select>
				</div>
				<div className="conf-tab__filter-group">
					<span className="conf-tab__filter-label">Mes desde</span>
					<select
						className="conf-tab__filter-select"
						value={filterMonthFrom}
						onChange={(e) => { setFilterMonthFrom(e.target.value ? Number(e.target.value) : ''); setCurrentPage(1) }}
					>
						<option value="">Todos</option>
						{MONTH_NAMES.map((name, i) => <option key={i + 1} value={i + 1}>{name}</option>)}
					</select>
				</div>
				<div className="conf-tab__filter-group">
					<span className="conf-tab__filter-label">Año hasta</span>
					<select
						className="conf-tab__filter-select"
						value={filterYearTo}
						onChange={(e) => { setFilterYearTo(e.target.value ? Number(e.target.value) : ''); setCurrentPage(1) }}
					>
						<option value="">Todos</option>
						{availableYears.map((y) => <option key={y} value={y}>{y}</option>)}
					</select>
				</div>
				<div className="conf-tab__filter-group">
					<span className="conf-tab__filter-label">Mes hasta</span>
					<select
						className="conf-tab__filter-select"
						value={filterMonthTo}
						onChange={(e) => { setFilterMonthTo(e.target.value ? Number(e.target.value) : ''); setCurrentPage(1) }}
					>
						<option value="">Todos</option>
						{MONTH_NAMES.map((name, i) => <option key={i + 1} value={i + 1}>{name}</option>)}
					</select>
				</div>
				<ClearFiltersButton
					active={filterMonth.trim() !== '' || filterYearFrom !== defaultYearFrom || filterMonthFrom !== '' || filterYearTo !== '' || filterMonthTo !== ''}
					onClear={() => { setFilterMonth(''); setFilterYearFrom(defaultYearFrom); setFilterMonthFrom(''); setFilterYearTo(''); setFilterMonthTo(''); setCurrentPage(1) }}
					tooltip="Limpiar filtros"
				/>
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
									<th>Mes</th>
									<th>Total Días</th>
									<th>Días Laborales</th>
									<th>Horas Mes</th>
									<th>Feriados</th>
									<th>Acciones</th>
								</tr>
							</thead>
							<tbody>
								{paginatedData.map((item) => (
									<tr key={item.id} className={item.monthKey === currentMonthKey ? 'conf-tab__table-row--current' : ''}>
										<td>{item.monthKey}</td>
										<td>{item.year}</td>
										<td>{item.month}</td>
										<td>{item.monthLabel ?? '-'}</td>
										<td>{item.totalDays}</td>
										<td>{item.workingDays}</td>
										<td>{item.hoursMonth ?? 0}</td>
										<td>{item.holidayDays || 0}</td>
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
					<form
						className="modal conf-modal--md"
						onClick={(e) => e.stopPropagation()}
						onSubmit={(e) => void handleSave(e)}
					>
						<div className="modal__header">
							<h2>{editingId ? 'Editar' : 'Nuevo'} calendario</h2>
							<button type="button" onClick={() => setShowModal(false)}>×</button>
						</div>
						<div className="modal__body">
							<div className="conf-form">
								<div className="conf-form__row">
									<div className="conf-form__group">
										<label className="conf-form__label">Año *</label>
										<input
											type="number"
											className="conf-form__input"
											value={formData.year ?? ''}
											onChange={(e) => {
												const y = e.target.value ? parseInt(e.target.value) : undefined
												const m = formData.month
												set({ year: y, monthKey: y && m ? `${y}-${String(m).padStart(2, '0')}` : '' })
											}}
											min="2000" max="2100"
											disabled={!!editingId}
											required={!editingId}
										/>
									</div>
									<div className="conf-form__group">
										<label className="conf-form__label">Mes (1-12) *</label>
										<input
											type="number"
											className="conf-form__input"
											value={formData.month ?? ''}
											onChange={(e) => {
												const m = e.target.value ? parseInt(e.target.value) : undefined
												const y = formData.year
												set({ month: m, monthKey: y && m ? `${y}-${String(m).padStart(2, '0')}` : '' })
											}}
											min="1" max="12"
											disabled={!!editingId}
											required={!editingId}
										/>
									</div>
								</div>

								<div className="conf-form__group">
									<label className="conf-form__label">Month key (generado)</label>
									<div className="conf-form__computed">{formData.monthKey || '—'}</div>
								</div>

								<div className="conf-form__row">
									<div className="conf-form__group">
										<label className="conf-form__label">Total Días (calculado)</label>
										<div className="conf-form__computed">
											{formData.year && formData.month
												? `${new Date(formData.year, formData.month, 0).getDate()} días`
												: '—'}
										</div>
									</div>
									<div className="conf-form__group">
										<label className="conf-form__label">Días Laborales *</label>
										<input type="number" className="conf-form__input" value={formData.workingDays ?? ''} onChange={(e) => set({ workingDays: e.target.value === '' ? undefined : parseInt(e.target.value) })} min="0" required />
									</div>
								</div>

								<div className="conf-form__row">
									<div className="conf-form__group">
										<label className="conf-form__label">Horas del mes (calculado)</label>
										<div className="conf-form__computed">{(formData.workingDays ?? 0) * 8} h</div>
									</div>
									<div className="conf-form__group">
										<label className="conf-form__label">Cant. feriados</label>
										<input type="number" className="conf-form__input" value={formData.holidayDays ?? ''} onChange={(e) => set({ holidayDays: e.target.value === '' ? undefined : parseInt(e.target.value) })} min="0" />
									</div>
								</div>

								<div className="conf-form__group">
									<label className="conf-form__label">Fechas de feriados (opcional)</label>
									{formHolidays.map((date, i) => (
										<div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
											<input
												type="date"
												className="conf-form__input"
												value={date}
												min={formData.year && formData.month ? `${formData.year}-${String(formData.month).padStart(2, '0')}-01` : undefined}
												max={formData.year && formData.month ? `${formData.year}-${String(formData.month).padStart(2, '0')}-${new Date(formData.year, formData.month, 0).getDate()}` : undefined}
												onChange={(e) => {
													const next = [...formHolidays]
													next[i] = e.target.value
													setFormHolidays(next)
												}}
											/>
											<button
												type="button"
												className="proyect-table__action proyect-table__action--delete"
												onClick={() => setFormHolidays(formHolidays.filter((_, j) => j !== i))}
												data-tooltip="Quitar"
											>
												<span className="material-icons">close</span>
											</button>
										</div>
									))}
									<button
										type="button"
										className="conf-btn conf-btn--secondary"
										onClick={() => setFormHolidays([...formHolidays, ''])}
										disabled={!formData.year || !formData.month}
										style={{ marginTop: 4 }}
									>
										<span className="material-icons" style={{ fontSize: 16 }}>add</span>
										Agregar feriado
									</button>
								</div>

								<div className="conf-form__group">
									<label className="conf-form__label">Notas</label>
									<textarea className="conf-form__textarea" value={formData.notes || ''} onChange={(e) => set({ notes: e.target.value || null })} rows={3} />
								</div>

								{formError && <div className="conf-tab__error">{formError}</div>}
							</div>
						</div>
						<div className="modal__actions">
							<button type="button" className="conf-btn conf-btn--secondary" onClick={() => setShowModal(false)}>Cancelar</button>
							<button type="submit" className="conf-btn conf-btn--primary" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
						</div>
					</form>
				</div>
			)}
		{createPortal(
			<AnimatePresence>
				{showDeleteModal && itemToDelete && (
					<motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
						<motion.div className="proyect-delete-modal" initial={{ scale: 0.94, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.94, opacity: 0, y: 10 }} transition={{ type: 'spring', stiffness: 280, damping: 22 }}>
							<div className="proyect-delete-modal__header">
								<span className="material-icons">report_problem</span>
								<h2>Eliminar calendario</h2>
							</div>
							<div className="proyect-delete-modal__content">
								<p>Vas a eliminar:</p>
								<p className="proyect-delete-modal__project">{itemToDelete.monthLabel ?? itemToDelete.monthKey}</p>
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

export default WorkingDaysCalendarTab
