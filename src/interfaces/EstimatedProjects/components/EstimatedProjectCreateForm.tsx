import { FC, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEstimatedProjectContext } from '../hooks/useEstimatedProjectContext.h'
import { ESTIMATED_PROJECT_CONFIG } from '../models/EstimatedProjectConfig.m'
import { ESTIMATED_PROJECT_PATHS } from '../routes/paths'
import { UserRefDto } from '../models/EstimatedProjectDTO.m'
import { getMonthsFromNow } from '../utils/months'
import { EstimatedProjectMonthlyGrid, MonthlyHoursState } from './EstimatedProjectMonthlyGrid'

interface FormState {
	clientId: string
	newClientName: string
	projectName: string
	code: string
	selectedUserIds: Set<number>
	monthCount: number
	monthlyHours: MonthlyHoursState
}

const initialForm: FormState = {
	clientId: '',
	newClientName: '',
	projectName: '',
	code: '',
	selectedUserIds: new Set(),
	monthCount: 3,
	monthlyHours: {},
}

export const EstimatedProjectCreateForm: FC = () => {
	const navigate = useNavigate()
	const { refs, loading } = useEstimatedProjectContext()

	const { FORM } = ESTIMATED_PROJECT_CONFIG

	const [form, setForm] = useState<FormState>(initialForm)
	const [userSearch, setUserSearch] = useState<string>('')

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

	const months = useMemo(() => getMonthsFromNow(form.monthCount), [form.monthCount])

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

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		const resources = selectedUsers.map((u) => {
			const userBucket = form.monthlyHours[u.Id] ?? {}
			const monthly: Record<string, number> = {}
			for (const [k, v] of Object.entries(userBucket)) {
				if (v > 0) monthly[k] = v
			}
			return { UserId: u.Id, UserName: u.FullName, MonthlyHours: monthly }
		})

		// 🔥 mock-only: solo log y volvemos al listado
		console.log('[ESTIMATED-PROYECT] submit', {
			clientId: form.clientId ? Number(form.clientId) : null,
			newClientName: form.newClientName.trim() || null,
			projectName: form.projectName.trim(),
			code: form.code.trim() || null,
			resources,
		})
		navigate(ESTIMATED_PROJECT_PATHS.LIST)
	}

	const canSubmit = (form.clientId !== '' || form.newClientName.trim() !== '') && form.projectName.trim() !== '' && form.selectedUserIds.size > 0

	const toggleAllLabel = form.selectedUserIds.size > 0 ? 'Deseleccionar todos' : FORM.FIELDS.RESOURCES.SELECT_ALL

	return (
		<form className="estimated-project-form" onSubmit={handleSubmit}>
			<header className="estimated-project-form__header">
				<button type="button" className="estimated-project-form__back" onClick={handleBack} data-tooltip={FORM.BACK_TOOLTIP}>
					{FORM.BACK_LABEL}
				</button>
				<h2 className="estimated-project-form__title">{FORM.TITLE_CREATE}</h2>
			</header>

			<div className="estimated-project-form__grid">
				{/* CLIENTE */}
				<div className="estimated-project-form__field">
					<label className="estimated-project-form__label">{FORM.FIELDS.CLIENT.LABEL} *</label>

					<select
						className="estimated-project-form__select"
						value={form.clientId}
						onChange={(e) => setForm((prev) => ({ ...prev, clientId: e.target.value, newClientName: '' }))}
						disabled={loading}
					>
						<option value="">{FORM.FIELDS.CLIENT.PLACEHOLDER_SELECT}</option>
						{refs?.clients
							?.filter((c) => c.IsActive)
							.map((c) => (
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
			/>

			{/* ACTIONS */}
			<footer className="estimated-project-form__actions">
				<button type="button" className="estimated-project-form__btn estimated-project-form__btn--cancel" onClick={handleBack}>
					{FORM.ACTIONS.CANCEL.LABEL}
				</button>
				<button type="submit" className="estimated-project-form__btn estimated-project-form__btn--confirm" disabled={!canSubmit}>
					{FORM.ACTIONS.CONFIRM.LABEL}
				</button>
			</footer>
		</form>
	)
}
