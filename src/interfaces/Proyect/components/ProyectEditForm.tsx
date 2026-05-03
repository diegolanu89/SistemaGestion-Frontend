import { FC, useEffect } from 'react'
import { Tooltip, useMediaQuery } from '@mui/material'
import { useProyectContext } from '../hooks/useProyectContext.h'
import { PROYECT_CONFIG } from '../models/ProyectConfig.m'
import { useProyectEditForm } from '../hooks/useProyectEditForm.h'
import { ProyectClockifyStatus } from './ProyectClockifyStatus'

export const ProyectEditForm: FC = () => {
	const { refs, closeEdit, selectedProject } = useProyectContext()
	const { CREATE, ACTIONS } = PROYECT_CONFIG
	const isSmallScreen = useMediaQuery('(max-width: 768px)')

	const { form, update, submit, submitting, setForm } = useProyectEditForm()

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
			LeaderName: selectedProject.LeaderName ?? undefined,
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

					<Tooltip
						title={CREATE.CLOCKIFY.TOOLTIP}
						placement="right"
						arrow
						disableHoverListener={isSmallScreen}
						disableFocusListener={isSmallScreen}
						disableTouchListener={isSmallScreen}
						slotProps={{
							tooltip: {
								sx: {
									fontSize: '13px',
									fontWeight: 500,
									px: 1.5,
									py: 1,
									borderRadius: '10px',
									bgcolor: 'var(--color-bg-alt)',
									color: 'var(--color-text-primary)',
									boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
									border: '1px solid var(--color-border-soft)',
								},
							},
							arrow: {
								sx: { color: 'var(--color-bg-alt)' },
							},
						}}
					>
						<label className="mui-switch">
							<input
								type="checkbox"
								checked={form.RequiresClockifyCreation ?? false}
								onChange={(e) => update('RequiresClockifyCreation')(e.target.checked)}
							/>
							<span className="mui-switch__track">
								<span className="mui-switch__thumb" />
							</span>
						</label>
					</Tooltip>
				</div>
			)}

			<div className="proyect-create-grid">
				<div className="proyect-create-field">
					<label className="proyect-create-label">
						<span className="material-icons">{CREATE.FIELDS.PROJECT_TYPE.ICON}</span>
						{CREATE.FIELDS.PROJECT_TYPE.LABEL}
					</label>

					<input className="proyect-create-input" value={selectedProject.ProjectType ?? ''} disabled />
				</div>

				<div className="proyect-create-field">
					<label className="proyect-create-label">
						<span className="material-icons">{CREATE.FIELDS.PROJECT_NAME.ICON}</span>
						{CREATE.FIELDS.PROJECT_NAME.LABEL} *
					</label>

					<input className="proyect-create-input" value={form.ProjectName ?? ''} onChange={(e) => update('ProjectName')(e.target.value)} required />
				</div>

				<div className="proyect-create-field">
					<label className="proyect-create-label">
						<span className="material-icons">business</span>
						Cliente *
					</label>

					<input
						className="proyect-create-input"
						type="number"
						value={form.ClientId ?? ''}
						onChange={(e) => update('ClientId')(e.target.value ? Number(e.target.value) : undefined)}
						required
					/>
				</div>

				<div className="proyect-create-field">
					<label className="proyect-create-label">
						<span className="material-icons">{CREATE.FIELDS.SECONDARY_NUMBER.ICON}</span>
						{CREATE.FIELDS.SECONDARY_NUMBER.LABEL} *
					</label>

					<input
						className="proyect-create-input"
						value={form.SecondaryProjectNumber ?? ''}
						onChange={(e) => update('SecondaryProjectNumber')(e.target.value)}
						required
					/>
				</div>

				<div className="proyect-create-field">
					<label className="proyect-create-label">
						<span className="material-icons">{CREATE.FIELDS.REGISTRATION_DATE.ICON}</span>
						{CREATE.FIELDS.REGISTRATION_DATE.LABEL} *
					</label>

					<input
						className="proyect-create-input"
						type="date"
						value={form.RegistrationDate ?? ''}
						onChange={(e) => update('RegistrationDate')(e.target.value || undefined)}
						required
					/>
				</div>

				<div className="proyect-create-field">
					<label className="proyect-create-label">
						<span className="material-icons">{CREATE.FIELDS.CATEGORY.ICON}</span>
						{CREATE.FIELDS.CATEGORY.LABEL} *
					</label>

					<select
						className="proyect-create-select"
						value={form.CategoryCode ?? ''}
						onChange={(e) => update('CategoryCode')(e.target.value || undefined)}
						required
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

				<div className="proyect-create-field">
					<label className="proyect-create-label">
						<span className="material-icons">{CREATE.FIELDS.STATUS.ICON}</span>
						{CREATE.FIELDS.STATUS.LABEL} *
					</label>

					<select
						className="proyect-create-select"
						value={form.ProjectStatusCode ?? ''}
						onChange={(e) => update('ProjectStatusCode')(e.target.value || undefined)}
						required
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

				{selectedType?.RequiresBusinessStatusDate && (
					<div className="proyect-create-field">
						<label className="proyect-create-label">
							<span className="material-icons">today</span>
							Fecha estado negocio *
						</label>

						<input
							className="proyect-create-input"
							type="date"
							value={form.BusinessStatusDate ?? ''}
							onChange={(e) => update('BusinessStatusDate')(e.target.value || undefined)}
							required
						/>
					</div>
				)}

				<div className="proyect-create-field">
					<label className="proyect-create-label">
						<span className="material-icons">event_available</span>
						Fecha estimada fin *
					</label>

					<input
						className="proyect-create-input"
						type="date"
						value={form.EstimatedEndDate ?? ''}
						onChange={(e) => update('EstimatedEndDate')(e.target.value || undefined)}
						required
					/>
				</div>

				{selectedType?.RequiresActualEndDate && (
					<div className="proyect-create-field">
						<label className="proyect-create-label">
							<span className="material-icons">event_busy</span>
							Fecha fin real *
						</label>

						<input
							className="proyect-create-input"
							type="date"
							value={form.ActualEndDate ?? ''}
							onChange={(e) => update('ActualEndDate')(e.target.value || undefined)}
							required
						/>
					</div>
				)}

				<div className="proyect-create-field">
					<label className="proyect-create-label">
						<span className="material-icons">person</span>
						Líder
					</label>

					<input className="proyect-create-input" value={form.LeaderName ?? ''} onChange={(e) => update('LeaderName')(e.target.value)} />
				</div>

				{selectedType?.RequiresCommercialFields && (
					<div className="proyect-create-field">
						<label className="proyect-create-label">
							<span className="material-icons">business_center</span>
							Estado comercial *
						</label>

						<input className="proyect-create-input" value={form.CommercialStatus ?? ''} onChange={(e) => update('CommercialStatus')(e.target.value)} required />
					</div>
				)}

				<div className="proyect-create-field proyect-create-field--full">
					<label className="proyect-create-label">
						<span className="material-icons">{CREATE.FIELDS.OBSERVATIONS.ICON}</span>
						{CREATE.FIELDS.OBSERVATIONS.LABEL}
					</label>

					<textarea className="proyect-create-textarea" rows={3} value={form.Observations ?? ''} onChange={(e) => update('Observations')(e.target.value)} />
				</div>
			</div>

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
