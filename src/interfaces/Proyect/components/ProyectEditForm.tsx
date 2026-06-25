import { FC, useEffect } from 'react'
import { useProyectContext } from '../hooks/useProyectContext.h'
import { PROYECT_CONFIG } from '../models/ProyectConfig.m'
import { useProyectEditForm } from '../hooks/useProyectEditForm.h'
import { ProyectTimesheetStatus } from './ProyectTimesheetStatus'
import { useIsSmallScreen } from '../../base/hooks/useSmallScreen.h'

export const ProyectEditForm: FC = () => {
	const { refs, closeEdit, selectedProject } = useProyectContext()
	const { CREATE, ACTIONS } = PROYECT_CONFIG
	const isSmallScreen = useIsSmallScreen()

	const { form, update, submit, submitting, validationErrors, backendError, setForm } = useProyectEditForm()

	const isAlreadySynced = Boolean(selectedProject?.TimesheetRecordId)
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
			StartDate: selectedProject.Tracking?.startDate ?? undefined,
			PlannedEndDate: selectedProject.Tracking?.plannedEndDate ?? undefined,
			ActualEndDate: selectedProject.Tracking?.actualEndDate ?? undefined,
			ImplementationDate: selectedProject.Tracking?.implementationDate ?? undefined,
			CommercialStatus: selectedProject.CommercialStatus ?? undefined,
			LeaderTimesheetUserId: selectedProject.LeaderTimesheetUserId ?? undefined,
			Observations: selectedProject.Observations ?? undefined,
			RequiresTimesheetCreation: selectedProject.RequiresTimesheetCreation,
		})
	}, [selectedProject, setForm])

	if (!refs || !selectedProject) return null

	return (
		<form
			className="proyect-create-form"
			onSubmit={(e) => {
				e.preventDefault()
				if (!e.currentTarget.checkValidity()) {
					e.currentTarget.reportValidity()
					return
				}
				void submit()
			}}
		>
			{isAlreadySynced ? (
				<ProyectTimesheetStatus project={selectedProject} />
			) : (
				<div className="proyect-create-timesheet">
					<div>
						<h3>
							<span className="material-icons">{CREATE.TIMESHEET.ICON}</span>
							{CREATE.TIMESHEET.TITLE}
						</h3>
						<p>{CREATE.TIMESHEET.DESCRIPTION}</p>
					</div>

					<label className="mui-switch" title={!isSmallScreen ? CREATE.TIMESHEET.TOOLTIP : ''}>
						<input type="checkbox" checked={form.RequiresTimesheetCreation ?? false} onChange={(e) => update('RequiresTimesheetCreation')(e.target.checked)} />
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
						type="number"
						inputMode="numeric"
						min={0}
						value={form.SecondaryProjectNumber ?? ''}
						onChange={(e) => update('SecondaryProjectNumber')(e.target.value.replace(/\D/g, ''))}
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

				{/* Fecha inicio */}
				<div className="proyect-create-field">
					<label className="proyect-create-label">
						<span className="material-icons">play_arrow</span>
						Fecha inicio
					</label>

					<input
						className="proyect-create-input"
						type="date"
						value={form.StartDate ?? ''}
						onChange={(e) => update('StartDate')(e.target.value || undefined)}
					/>
				</div>

				{/* Fin planificado */}
				<div className="proyect-create-field">
					<label className="proyect-create-label">
						<span className="material-icons">event_available</span>
						Fin planificado
					</label>

					<input
						className="proyect-create-input"
						type="date"
						value={form.PlannedEndDate ?? ''}
						onChange={(e) => update('PlannedEndDate')(e.target.value || undefined)}
					/>
				</div>

				{/* Fin real */}
				<div className="proyect-create-field">
					<label className="proyect-create-label">
						<span className="material-icons">event_busy</span>
						Fin real
					</label>

					<input
						className="proyect-create-input"
						type="date"
						value={form.ActualEndDate ?? ''}
						onChange={(e) => update('ActualEndDate')(e.target.value || undefined)}
					/>
				</div>

				{/* Fecha implementación */}
				<div className="proyect-create-field">
					<label className="proyect-create-label">
						<span className="material-icons">rocket_launch</span>
						Fecha implementación
					</label>

					<input
						className="proyect-create-input"
						type="date"
						value={form.ImplementationDate ?? ''}
						onChange={(e) => update('ImplementationDate')(e.target.value || undefined)}
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
						value={form.LeaderTimesheetUserId ?? ''}
						onChange={(e) => update('LeaderTimesheetUserId')(e.target.value ? Number(e.target.value) : undefined)}
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

			{backendError && (
				<ul className="proyect-create-errors">
					{backendError.split('\n').filter(Boolean).map((line, i) => (
						<li key={i} className="proyect-create-error-item">
							<span className="material-icons">error_outline</span>
							{line}
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
