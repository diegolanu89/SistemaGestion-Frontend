import { FC, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEstimatedProjectContext } from '../hooks/useEstimatedProjectContext.h'
import { ESTIMATED_PROJECT_CONFIG } from '../models/EstimatedProjectConfig.m'
import { ESTIMATED_PROJECT_PATHS } from '../routes/paths'
import { UserRefDto, EstimatedResourceDto, ValidateCapacityEntryDto, ValidateCapacityErrorDto } from '../models/EstimatedProjectDTO.m'
import { earlierOf, getMonthsFromNow, monthKeyOf, monthsBetween, MonthSlot, parseMonthKey } from '../utils/months'
import { EstimatedProjectMonthlyGrid, MonthlyHoursState } from './EstimatedProjectMonthlyGrid'
import { estimatedProjectAdapter } from '../services/EstimatedProjectAdapter.s'

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'

interface FormState {
	clientId: string
	newClientName: string
	projectName: string
	code: string
	selectedUserIds: Set<number>
	monthCount: number
	monthlyHours: MonthlyHoursState
	/** Mes inicial visible en la grilla. Permite que en edit se vean meses anteriores al actual. */
	anchorMonth: string
}

const buildInitialForm = (): FormState => ({
	clientId: '',
	newClientName: '',
	projectName: '',
	code: '',
	selectedUserIds: new Set(),
	monthCount: 3,
	monthlyHours: {},
	anchorMonth: monthKeyOf(new Date()),
})

const buildResources = (selectedUsers: UserRefDto[], monthlyHours: MonthlyHoursState): EstimatedResourceDto[] =>
	selectedUsers.map((u) => {
		const bucket = monthlyHours[u.Id] ?? {}
		const monthly: Record<string, number> = {}
		for (const [k, v] of Object.entries(bucket)) {
			if (v > 0) monthly[k] = v
		}
		return { UserId: u.Id, UserName: u.FullName, MonthlyHours: monthly }
	})

const buildValidateEntries = (resources: EstimatedResourceDto[], months: MonthSlot[]): ValidateCapacityEntryDto[] => {
	const monthLabel = (key: string) => months.find((m) => m.key === key)?.label ?? key
	const entries: ValidateCapacityEntryDto[] = []
	for (const r of resources) {
		for (const [monthKey, hours] of Object.entries(r.MonthlyHours)) {
			if (hours <= 0) continue
			entries.push({ userName: r.UserName, monthKey, monthLabel: monthLabel(monthKey), hours })
		}
	}
	return entries
}

interface Props {
	editingId?: number | null
}

export const EstimatedProjectCreateForm: FC<Props> = ({ editingId = null }) => {
	const navigate = useNavigate()
	const { refs, loading: loadingRefs, refetch } = useEstimatedProjectContext()

	const { FORM } = ESTIMATED_PROJECT_CONFIG

	const [form, setForm] = useState<FormState>(buildInitialForm)
	const [userSearch, setUserSearch] = useState<string>('')
	const [submitting, setSubmitting] = useState<boolean>(false)
	const [validationErrors, setValidationErrors] = useState<ValidateCapacityErrorDto[]>([])
	const [submitError, setSubmitError] = useState<string | null>(null)
	const [loadingEdit, setLoadingEdit] = useState<boolean>(!!editingId)
	const [editLoadError, setEditLoadError] = useState<string | null>(null)

	const isEditing = editingId !== null

	// ==========================
	// Edit prefill
	// ==========================
	useEffect(() => {
		if (!editingId) return

		let cancelled = false

		void (async () => {
			setLoadingEdit(true)
			setEditLoadError(null)

			try {
				const project = await estimatedProjectAdapter.getById(editingId)
				if (cancelled) return

				if (!project) {
					setEditLoadError('Proyecto no encontrado')
					return
				}

				const monthlyHours: MonthlyHoursState = {}
				const selectedIds = new Set<number>()

				let earliestKey: string | null = null
				let latestKey: string | null = null

				for (const r of project.Resources) {
					if (r.UserId == null) continue
					selectedIds.add(r.UserId)
					monthlyHours[r.UserId] = {}
					for (const [mk, hrs] of Object.entries(r.MonthlyHours)) {
						monthlyHours[r.UserId][mk] = hrs
						if (!earliestKey || mk < earliestKey) earliestKey = mk
						if (!latestKey || mk > latestKey) latestKey = mk
					}
				}

				const today = new Date()
				const anchorDate = earliestKey ? earlierOf(parseMonthKey(earliestKey), today) : today
				const latestDate = latestKey ? parseMonthKey(latestKey) : today
				const monthCount = Math.max(3, monthsBetween(anchorDate, latestDate) + 1)

				setForm({
					clientId: project.ClientId !== null ? String(project.ClientId) : '',
					newClientName: '',
					projectName: project.Name,
					code: project.Code ?? '',
					selectedUserIds: selectedIds,
					monthCount,
					monthlyHours,
					anchorMonth: monthKeyOf(anchorDate),
				})
			} catch (error: unknown) {
				const err = error instanceof Error ? error : new Error('Unknown error loading project')
				logger.errorTag(LogTag.Adapter, err)
				if (!cancelled) setEditLoadError(err.message)
			} finally {
				if (!cancelled) setLoadingEdit(false)
			}
		})()

		return () => {
			cancelled = true
		}
	}, [editingId])

	const filteredUsers = useMemo<UserRefDto[]>(() => {
		if (!refs?.users) return []
		const term = userSearch.toLowerCase().trim()
		const active = refs.users.filter((u) => u.IsActive)
		if (!term) return active
		return active.filter((u) => u.FullName.toLowerCase().includes(term) || u.Username.toLowerCase().includes(term))
	}, [refs, userSearch])

	const selectedUsers = useMemo<UserRefDto[]>(() => {
		if (!refs?.users) return []
		return refs.users.filter((u) => form.selectedUserIds.has(u.Id))
	}, [refs, form.selectedUserIds])

	const months = useMemo(() => {
		const anchorDate = parseMonthKey(form.anchorMonth)
		return getMonthsFromNow(form.monthCount, anchorDate)
	}, [form.monthCount, form.anchorMonth])

	const toggleUser = (userId: number) => {
		setForm((prev) => {
			const next = new Set(prev.selectedUserIds)
			let nextHours = prev.monthlyHours
			if (next.has(userId)) {
				next.delete(userId)
				if (nextHours[userId]) {
					const { [userId]: _drop, ...rest } = nextHours
					nextHours = rest
				}
			} else {
				next.add(userId)
			}
			return { ...prev, selectedUserIds: next, monthlyHours: nextHours }
		})
	}

	const toggleAllVisible = () => {
		setForm((prev) => {
			if (prev.selectedUserIds.size > 0) {
				return { ...prev, selectedUserIds: new Set(), monthlyHours: {} }
			}
			const next = new Set(prev.selectedUserIds)
			filteredUsers.forEach((u) => next.add(u.Id))
			return { ...prev, selectedUserIds: next }
		})
	}

	const updateHours = (userId: number, monthKey: string, hours: number) => {
		setForm((prev) => {
			const userBucket = { ...(prev.monthlyHours[userId] ?? {}), [monthKey]: hours }
			return { ...prev, monthlyHours: { ...prev.monthlyHours, [userId]: userBucket } }
		})
	}

	const setMonthCount = (count: number) => setForm((prev) => ({ ...prev, monthCount: count }))

	const handleBack = () => navigate(ESTIMATED_PROJECT_PATHS.LIST)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (submitting) return

		setSubmitting(true)
		setValidationErrors([])
		setSubmitError(null)

		try {
			const resources = buildResources(selectedUsers, form.monthlyHours)
			const validateEntries = buildValidateEntries(resources, months)

			if (validateEntries.length > 0) {
				const validation = await estimatedProjectAdapter.validateCapacity({
					entries: validateEntries,
					potencialProjectId: editingId,
				})
				if (!validation.valid) {
					setValidationErrors(validation.errors)
					return
				}
			}

			if (isEditing && editingId !== null) {
				await estimatedProjectAdapter.update(editingId, {
					ClientId: form.clientId ? Number(form.clientId) : null,
					NewClientName: form.newClientName.trim() || null,
					Name: form.projectName.trim(),
					Code: form.code.trim() || null,
					Resources: resources,
				})
			} else {
				await estimatedProjectAdapter.create({
					ClientId: form.clientId ? Number(form.clientId) : null,
					NewClientName: form.newClientName.trim() || null,
					Name: form.projectName.trim(),
					Code: form.code.trim() || null,
					Resources: resources,
				})
			}

			await refetch()
			navigate(ESTIMATED_PROJECT_PATHS.LIST)
		} catch (error: unknown) {
			const err = error instanceof Error ? error : new Error('Unknown error saving estimated project')
			logger.errorTag(LogTag.Adapter, err)
			setSubmitError(err.message)
		} finally {
			setSubmitting(false)
		}
	}

	const canSubmit = (form.clientId !== '' || form.newClientName.trim() !== '') && form.projectName.trim() !== '' && form.selectedUserIds.size > 0

	const toggleAllLabel = form.selectedUserIds.size > 0 ? 'Deseleccionar todos' : FORM.FIELDS.RESOURCES.SELECT_ALL

	const title = isEditing ? FORM.TITLE_EDIT : FORM.TITLE_CREATE

	if (editLoadError) {
		return (
			<div className="estimated-project-form">
				<div className="estimated-project-form__errors">{editLoadError}</div>
				<button type="button" className="estimated-project-form__btn estimated-project-form__btn--cancel" onClick={handleBack}>
					{FORM.ACTIONS.CANCEL.LABEL}
				</button>
			</div>
		)
	}

	if (loadingEdit) {
		return <div className="estimated-project-form__loading">Cargando proyecto…</div>
	}

	return (
		<form className="estimated-project-form" onSubmit={handleSubmit}>
			<header className="estimated-project-form__header">
				<button type="button" className="estimated-project-form__back" onClick={handleBack} data-tooltip={FORM.BACK_TOOLTIP}>
					{FORM.BACK_LABEL}
				</button>
				<h2 className="estimated-project-form__title">{title}</h2>
			</header>

			<div className="estimated-project-form__grid">
				{/* CLIENTE */}
				<div className="estimated-project-form__field">
					<label className="estimated-project-form__label">{FORM.FIELDS.CLIENT.LABEL} *</label>

					<select
						className="estimated-project-form__select"
						value={form.clientId}
						onChange={(e) => setForm((prev) => ({ ...prev, clientId: e.target.value, newClientName: '' }))}
						disabled={loadingRefs}
					>
						<option value="">{FORM.FIELDS.CLIENT.PLACEHOLDER_SELECT}</option>
						{refs?.clients?.map((c) => (
							<option key={c.Id} value={c.Id}>
								{c.Name}
							</option>
						))}
					</select>

					<input
						className="estimated-project-form__input estimated-project-form__input--secondary"
						placeholder={FORM.FIELDS.CLIENT.PLACEHOLDER_NEW}
						value={form.newClientName}
						onChange={(e) => setForm((prev) => ({ ...prev, newClientName: e.target.value, clientId: '' }))}
					/>
				</div>

				{/* PROYECTO */}
				<div className="estimated-project-form__field">
					<label className="estimated-project-form__label">{FORM.FIELDS.PROJECT_NAME.LABEL} *</label>
					<input
						className="estimated-project-form__input"
						placeholder={FORM.FIELDS.PROJECT_NAME.PLACEHOLDER}
						value={form.projectName}
						onChange={(e) => setForm((prev) => ({ ...prev, projectName: e.target.value }))}
						required
					/>
				</div>

				{/* CÓDIGO */}
				<div className="estimated-project-form__field">
					<label className="estimated-project-form__label">{FORM.FIELDS.CODE.LABEL}</label>
					<input
						className="estimated-project-form__input"
						placeholder={FORM.FIELDS.CODE.PLACEHOLDER}
						value={form.code}
						onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value }))}
					/>
				</div>
			</div>

			{/* RECURSOS */}
			<section className="estimated-project-form__resources">
				<label className="estimated-project-form__label">{FORM.FIELDS.RESOURCES.LABEL} *</label>

				<div className="estimated-project-form__resources-search">
					<span className="material-icons">search</span>
					<input
						className="estimated-project-form__input"
						placeholder={FORM.FIELDS.RESOURCES.SEARCH_PLACEHOLDER}
						value={userSearch}
						onChange={(e) => setUserSearch(e.target.value)}
					/>
				</div>

				<div className="estimated-project-form__resources-actions">
					<button type="button" className="estimated-project-form__btn-ghost" onClick={toggleAllVisible}>
						{toggleAllLabel}
					</button>
					<span className="estimated-project-form__count">{form.selectedUserIds.size} seleccionados</span>
				</div>

				<div className="estimated-project-form__user-grid">
					{filteredUsers.map((u) => {
						const checked = form.selectedUserIds.has(u.Id)
						return (
							<label key={u.Id} className={`estimated-project-form__user ${checked ? 'is-checked' : ''}`}>
								<input type="checkbox" checked={checked} onChange={() => toggleUser(u.Id)} />
								<span className="estimated-project-form__user-name">{u.FullName}</span>
							</label>
						)
					})}

					{filteredUsers.length === 0 && <div className="estimated-project-form__empty">Sin resultados</div>}
				</div>
			</section>

			{/* GRILLA MENSUAL DE HORAS (RF-09) */}
			<EstimatedProjectMonthlyGrid
				months={months}
				monthCount={form.monthCount}
				onMonthCountChange={setMonthCount}
				selectedUsers={selectedUsers}
				values={form.monthlyHours}
				onChange={updateHours}
				potencialProjectId={editingId}
			/>

			{/* ERRORES */}
			{validationErrors.length > 0 && (
				<div className="estimated-project-form__errors">
					<h4>No se puede guardar — el back rechazó la capacidad:</h4>
					<ul>
						{validationErrors.map((err, idx) => (
							<li key={`${err.user_name}-${err.month_key}-${idx}`}>{err.message}</li>
						))}
					</ul>
				</div>
			)}

			{submitError && <div className="estimated-project-form__errors">{submitError}</div>}

			{/* ACTIONS */}
			<footer className="estimated-project-form__actions">
				<button type="button" className="estimated-project-form__btn estimated-project-form__btn--cancel" onClick={handleBack}>
					{FORM.ACTIONS.CANCEL.LABEL}
				</button>
				<button type="submit" className="estimated-project-form__btn estimated-project-form__btn--confirm" disabled={!canSubmit || submitting}>
					{submitting ? 'Guardando…' : FORM.ACTIONS.CONFIRM.LABEL}
				</button>
			</footer>
		</form>
	)
}
