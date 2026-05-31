import { FC, useEffect } from 'react'
import { useProyectContext } from '../hooks/useProyectContext.h'
import { PROYECT_CONFIG } from '../models/ProyectConfig.m'
import { useProyectEditForm } from '../hooks/useProyectEditForm.h'
import { ProyectClockifyStatus } from './ProyectClockifyStatus'
import { useIsSmallScreen } from '../../base/hooks/useSmallScreen.h'

export const ProyectEditForm: FC = () => {
	const { refs, closeEdit, selectedProject } = useProyectContext()
	const { CREATE, ACTIONS } = PROYECT_CONFIG
	const isSmallScreen = useIsSmallScreen()

	const { form, update, submit, submitting, validationErrors, setForm } = useProyectEditForm()

	const isAlreadySynced = Boolean(selectedProject?.ClockifyRecordId)
	const selectedType = refs?.types.find((t) => t.Code === selectedProject?.ProjectType)

	useEffect(() => {
		if (!selectedProject) return

		setForm({
			ProjectName: selectedProject.ProjectName ?? undefined,
			ClientId: selectedProject.ClientId ?? undefined,
			SecondaryProjectNumber: selectedProject.SecondaryProjectNumber ?? undefined,
			RegistrationDate: selectedProject.RegistrationDate ?? undefined,
			CategoryCode: selectedProject.CategoryCode ?? undefined,
			ProjectStatusCode: selectedProject.ProjectStatusCode ?? undefined,
			BusinessStatusDate: selectedProject.BusinessStatusDate ?? undefined,
			EstimatedEndDate: selectedProject.EstimatedEndDate ?? undefined,
			ActualEndDate: selectedProject.ActualEndDate ?? undefined,
			CommercialStatus: selectedProject.CommercialStatus ?? undefined,
			LeaderClockifyUserId: selectedProject.LeaderClockifyUserId ?? undefined,
			Observations: selectedProject.Observations ?? undefined,
			RequiresClockifyCreation: selectedProject.RequiresClockifyCreation,
		})
	}, [selectedProject, setForm])

	if (!refs || !selectedProject) return null

	return (
		<form
			className="proyect-create-form"
			onSubmit={(e) => {
				e.preventDefault()
				void submit()
			}}
		>
			{isAlreadySynced ? (
				<ProyectClockifyStatus project={selectedProject} />
			) : (
				<div className="proyect-create-clockify">
					<div>
						<h3>
							<span className="material-icons">{CREATE.CLOCKIFY.ICON}</span>
							{CREATE.CLOCKIFY.TITLE}
						</h3>
						<p>{CREATE.CLOCKIFY.DESCRIPTION}</p>
					</div>

					<label className="mui-switch" title={!isSmallScreen ? CREATE.CLOCKIFY.TOOLTIP : ''}>
						<input type="checkbox" checked={form.RequiresClockifyCreation ?? false} onChange={(e) => update('RequiresClockifyCreation')(e.target.checked)} />
						<span className="mui-switch__track">
							<span className="mui-switch__thumb" />
						</span>
					</label>
				</div>
			)}

			<div className="proyect-create-grid">
				{/* Nº de Proyecto de Desarrollo — solo lectura */}
				<div className="proyect-create-field">
					<label className="proyect-create-label">
						<span className="material-icons">tag</span>
						Nº de Proyecto de Desarrollo
					</label>

					<input
						className="proyect-create-input"
						value={selectedProject.InternalProjectNumber ?? '—'}
						disabled
						readOnly
					/>
				</div>

				{/* Nº de Proyecto Comercial */}
				<div className="proyect-create-field">
					<label className="proyect-create-label">
						<span className="material-icons">{CREATE.FIELDS.SECONDARY_NUMBER.ICON}</span>
						{CREATE.FIELDS.SECONDARY_NUMBER.LABEL}
					</label>

					<input
						className="proyect-create-input"
						value={form.SecondaryProjectNumber ?? ''}
						onChange={(e) => update('SecondaryProjectNumber')(e.target.value)}
					/>
				</div>

				{/* Fecha de alta */}
				<div className="proyect-create-field">
					<label className="proyect-create-label">
						<span className="material-icons">{CREATE.FIELDS.REGISTRATION_DATE.ICON}</span>
						{CREATE.FIELDS.REGISTRATION_DATE.LABEL}
					</label>

					<input
						className="proyect-create-input"
						type="date"
						value={form.RegistrationDate ?? ''}
						onChange={(e) => update('RegistrationDate')(e.target.value || undefined)}
					/>
				</div>

				{/* Cliente */}
				<div className="proyect-create-field">
					<label className="proyect-create-label">
						<span className="material-icons">business</span>
						Cliente
					</label>

					<select
						className="proyect-create-select"
						value={form.ClientId ?? ''}
						onChange={(e) => update('ClientId')(e.target.value ? Number(e.target.value) : undefined)}
					>
						<option value="">{CREATE.PLACEHOLDERS.SELECT}</option>
						{(refs.clients ?? []).map((c) => (
							<option key={c.Id} value={c.Id}>
								{c.Name}
							</option>
						))}
					</select>
				</div>

				{/* Proyecto */}
				<div className="proyect-create-field">
					<label className="proyect-create-label">
						<span className="material-icons">{CREATE.FIELDS.PROJECT_NAME.ICON}</span>
						{CREATE.FIELDS.PROJECT_NAME.LABEL} *
					</label>

					<input
						className="proyect-create-input"
						value={form.ProjectName ?? ''}
						onChange={(e) => update('ProjectName')(e.target.value)}
						maxLength={40}
						required
					/>
				</div>

				{/* Categoría */}
				<div className="proyect-create-field">
					<label className="proyect-create-label">
						<span className="material-icons">{CREATE.FIELDS.CATEGORY.ICON}</span>
						{CREATE.FIELDS.CATEGORY.LABEL}
					</label>

					<select
						className="proyect-create-select"
						value={form.CategoryCode ?? ''}
						onChange={(e) => update('CategoryCode')(e.target.value || undefined)}
					>
						<option value="">{CREATE.PLACEHOLDERS.EMPTY}</option>
						{refs.categories
							.filter((c) => c.IsActive)
							.map((c) => (
								<option key={c.Code} value={c.Code}>
									{c.Label}
								</option>
							))}
					</select>
				</div>

				{/* Estado del proyecto */}
				<div className="proyect-create-field">
					<label className="proyect-create-label">
						<span className="material-icons">{CREATE.FIELDS.STATUS.ICON}</span>
						{CREATE.FIELDS.STATUS.LABEL}
					</label>

					<select
						className="proyect-create-select"
						value={form.ProjectStatusCode ?? ''}
						onChange={(e) => update('ProjectStatusCode')(e.target.value || undefined)}
					>
						<option value="">{CREATE.PLACEHOLDERS.EMPTY}</option>
						{refs.statuses
							.filter((s) => s.IsActive)
							.map((s) => (
								<option key={s.Code} value={s.Code}>
									{s.Label}
								</option>
							))}
					</select>
				</div>

				{/* Fecha ingreso/perdido/cerrado */}
				<div className="proyect-create-field">
					<label className="proyect-create-label">
						<span className="material-icons">today</span>
						Fecha ingreso/perdido/cerrado{selectedType?.RequiresBusinessStatusDate ? ' *' : ''}
					</label>

					<input
						className="proyect-create-input"
						type="date"
						value={form.BusinessStatusDate ?? ''}
						onChange={(e) => update('BusinessStatusDate')(e.target.value || undefined)}
						required={selectedType?.RequiresBusinessStatusDate ?? false}
					/>
				</div>

				{/* Fecha estimada de terminación */}
				<div className="proyect-create-field">
					<label className="proyect-create-label">
						<span className="material-icons">event_available</span>
						Fecha estimada de terminación
					</label>

					<input
						className="proyect-create-input"
						type="date"
						value={form.EstimatedEndDate ?? ''}
						onChange={(e) => update('EstimatedEndDate')(e.target.value || undefined)}
					/>
				</div>

				{/* Fecha de fin del proyecto */}
				<div className="proyect-create-field">
					<label className="proyect-create-label">
						<span className="material-icons">event_busy</span>
						Fecha de fin del proyecto{selectedType?.RequiresActualEndDate ? ' *' : ''}
					</label>

					<input
						className="proyect-create-input"
						type="date"
						value={form.ActualEndDate ?? ''}
						onChange={(e) => update('ActualEndDate')(e.target.value || undefined)}
						required={selectedType?.RequiresActualEndDate ?? false}
					/>
				</div>

				{/* Estado comercial */}
				<div className="proyect-create-field">
					<label className="proyect-create-label">
						<span className="material-icons">business_center</span>
						Estado comercial{selectedType?.RequiresCommercialFields ? ' *' : ''}
					</label>

					<input
						className="proyect-create-input"
						value={form.CommercialStatus ?? ''}
						onChange={(e) => update('CommercialStatus')(e.target.value)}
						required={selectedType?.RequiresCommercialFields ?? false}
					/>
				</div>

				{/* Líder */}
				<div className="proyect-create-field">
					<label className="proyect-create-label">
						<span className="material-icons">person</span>
						Líder
					</label>

					<select
						className="proyect-create-select"
						value={form.LeaderClockifyUserId ?? ''}
						onChange={(e) => update('LeaderClockifyUserId')(e.target.value ? Number(e.target.value) : undefined)}
					>
						<option value="">{CREATE.PLACEHOLDERS.SELECT}</option>
						{(refs.leaders ?? []).map((l) => (
							<option key={l.Id} value={l.Id}>
								{l.Name}
							</option>
						))}
					</select>
				</div>

				{/* Observaciones */}
				<div className="proyect-create-field proyect-create-field--full">
					<label className="proyect-create-label">
						<span className="material-icons">{CREATE.FIELDS.OBSERVATIONS.ICON}</span>
						{CREATE.FIELDS.OBSERVATIONS.LABEL}
					</label>

					<textarea
						className="proyect-create-textarea"
						rows={3}
						value={form.Observations ?? ''}
						onChange={(e) => update('Observations')(e.target.value)}
					/>
				</div>
			</div>

			{validationErrors.length > 0 && (
				<ul className="proyect-create-errors">
					{validationErrors.map((err, i) => (
						<li key={i} className="proyect-create-error-item">
							<span className="material-icons">error_outline</span>
							{err}
						</li>
					))}
				</ul>
			)}

			<div className="modal__actions">
				<button type="button" className="proyect-create-btn proyect-create-btn--cancel" onClick={closeEdit}>
					{ACTIONS.CANCEL.LABEL}
				</button>

				<button type="submit" className="proyect-create-btn proyect-create-btn--confirm" disabled={submitting}>
					Guardar cambios
				</button>
			</div>
		</form>
	)
}
