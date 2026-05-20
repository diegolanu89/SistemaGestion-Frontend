import { FC } from 'react'
import { useProyectContext } from '../hooks/useProyectContext.h'
import { PROYECT_CONFIG } from '../models/ProyectConfig.m'
import { useProyectCreateForm } from '../hooks/useProyectCreate.h'
import { useIsSmallScreen } from '../../base/hooks/useSmallScreen.h'

export const ProyectCreateForm: FC = () => {
	const { refs, closeCreate } = useProyectContext()
	const { CREATE, ACTIONS } = PROYECT_CONFIG
	const isSmallScreen = useIsSmallScreen()

	const { form, update, submit, submitting, validationErrors, nextNumber, loadingNextNumber } = useProyectCreateForm()

	const selectedType = refs?.types.find((t) => t.Code === form.projectType)

	if (!refs) return null

	return (
		<form
			className="proyect-create-form"
			onSubmit={(e) => {
				e.preventDefault()
				void submit()
			}}
		>
			<div className="proyect-create-clockify">
				<div>
					<h3>
						<span className="material-icons">{CREATE.CLOCKIFY.ICON}</span>
						{CREATE.CLOCKIFY.TITLE}
					</h3>
					<p>{CREATE.CLOCKIFY.DESCRIPTION}</p>
				</div>

				<label className="mui-switch" title={!isSmallScreen ? CREATE.CLOCKIFY.TOOLTIP : ''}>
					<input type="checkbox" checked={form.requiresClockifyCreation} onChange={(e) => update('requiresClockifyCreation')(e.target.checked)} />
					<span className="mui-switch__track">
						<span className="mui-switch__thumb" />
					</span>
				</label>
			</div>

			<div className="proyect-create-grid">
				{/* Tipo de proyecto */}
				<div className="proyect-create-field">
					<label className="proyect-create-label">
						<span className="material-icons">{CREATE.FIELDS.PROJECT_TYPE.ICON}</span>
						{CREATE.FIELDS.PROJECT_TYPE.LABEL} *
					</label>

					<select className="proyect-create-select" value={form.projectType ?? ''} onChange={(e) => update('projectType')(e.target.value)} required>
						<option value="">{CREATE.PLACEHOLDERS.SELECT}</option>
						{refs.types
							.filter((t) => t.IsActive)
							.map((t) => (
								<option key={t.Code} value={t.Code}>
									{t.Label} {t.Code}.XXX
								</option>
							))}
					</select>
				</div>

				{/* Nº de Proyecto de Desarrollo (disabled, auto-calculado) */}
				<div className="proyect-create-field">
					<label className="proyect-create-label">
						<span className="material-icons">tag</span>
						Nº de Proyecto de Desarrollo
					</label>

					<input
						className="proyect-create-input"
						value={loadingNextNumber ? 'Cargando...' : (nextNumber ?? '')}
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
						value={form.secondaryProjectNumber ?? ''}
						onChange={(e) => update('secondaryProjectNumber')(e.target.value)}
					/>
				</div>

				{/* Fecha de alta de Nº de Proyecto de Desarrollo */}
				<div className="proyect-create-field">
					<label className="proyect-create-label">
						<span className="material-icons">{CREATE.FIELDS.REGISTRATION_DATE.ICON}</span>
						{CREATE.FIELDS.REGISTRATION_DATE.LABEL}
					</label>

					<input
						className="proyect-create-input"
						type="date"
						value={form.registrationDate ?? ''}
						onChange={(e) => update('registrationDate')(e.target.value || null)}
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
						value={form.clientId ?? ''}
						onChange={(e) => update('clientId')(e.target.value ? Number(e.target.value) : null)}
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

					<input className="proyect-create-input" value={form.projectName ?? ''} onChange={(e) => update('projectName')(e.target.value)} required />
				</div>

				{/* Categoría */}
				<div className="proyect-create-field">
					<label className="proyect-create-label">
						<span className="material-icons">{CREATE.FIELDS.CATEGORY.ICON}</span>
						{CREATE.FIELDS.CATEGORY.LABEL}
					</label>

					<select className="proyect-create-select" value={form.categoryCode ?? ''} onChange={(e) => update('categoryCode')(e.target.value || null)}>
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
						value={form.projectStatusCode ?? ''}
						onChange={(e) => update('projectStatusCode')(e.target.value || null)}
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
						value={form.businessStatusDate ?? ''}
						onChange={(e) => update('businessStatusDate')(e.target.value || null)}
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
						value={form.estimatedEndDate ?? ''}
						onChange={(e) => update('estimatedEndDate')(e.target.value || null)}
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
						value={form.actualEndDate ?? ''}
						onChange={(e) => update('actualEndDate')(e.target.value || null)}
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
						value={form.commercialStatus ?? ''}
						onChange={(e) => update('commercialStatus')(e.target.value)}
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
						value={form.leaderClockifyUserId ?? ''}
						onChange={(e) => update('leaderClockifyUserId')(e.target.value ? Number(e.target.value) : null)}
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

					<textarea className="proyect-create-textarea" rows={3} value={form.observations ?? ''} onChange={(e) => update('observations')(e.target.value)} />
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
				<button type="button" className="proyect-create-btn proyect-create-btn--cancel" onClick={closeCreate}>
					{ACTIONS.CANCEL.LABEL}
				</button>

				<button type="submit" className="proyect-create-btn proyect-create-btn--confirm" disabled={submitting}>
					{ACTIONS.CONFIRM.LABEL}
				</button>
			</div>
		</form>
	)
}
