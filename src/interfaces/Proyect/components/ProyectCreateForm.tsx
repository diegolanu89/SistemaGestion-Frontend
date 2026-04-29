/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC } from 'react'
import { useProyectContext } from '../hooks/useProyectContext.h'
import { PROYECT_CONFIG } from '../models/ProyectConfig.m'
import { useProyectCreateForm } from '../hooks/useProyectCreate.h'

export const ProyectCreateForm: FC = () => {
	const { refs, closeCreate } = useProyectContext()
	const { CREATE, ACTIONS } = PROYECT_CONFIG
	const { form, update, submit, submitting } = useProyectCreateForm()

	if (!refs) return null

	return (
		<form
			className="proyect-create-form"
			onSubmit={(e) => {
				e.preventDefault()
				void submit()
			}}
		>
			{/* ================= CLOCKIFY ================= */}
			<div className="proyect-create-clockify" data-tooltip={CREATE.CLOCKIFY.TOOLTIP}>
				<div>
					<h3>
						<span className="material-icons">{CREATE.CLOCKIFY.ICON}</span>
						{CREATE.CLOCKIFY.TITLE}
					</h3>
					<p>{CREATE.CLOCKIFY.DESCRIPTION}</p>
				</div>

				<label className="mui-switch">
					<input type="checkbox" checked={form.RequiresClockifyCreation} onChange={(e) => update('RequiresClockifyCreation')(e.target.checked)} />
					<span className="mui-switch__track">
						<span className="mui-switch__thumb" />
					</span>
				</label>
			</div>

			{/* ================= GRID ================= */}
			<div className="proyect-create-grid">
				{/* TIPO */}
				<div className="proyect-create-field">
					<label className="proyect-create-label">
						<span className="material-icons">{CREATE.FIELDS.PROJECT_TYPE.ICON}</span>
						{CREATE.FIELDS.PROJECT_TYPE.LABEL} *
					</label>

					<select className="proyect-create-select" value={form.ProjectType ?? ''} onChange={(e) => update('ProjectType')(e.target.value)} required>
						<option value="">{CREATE.PLACEHOLDERS.SELECT}</option>
						{refs.types
							.filter((t) => t.IsActive)
							.map((t) => (
								<option key={t.Code} value={t.Code}>
									{t.Label}
								</option>
							))}
					</select>
				</div>

				{/* NOMBRE */}
				<div className="proyect-create-field">
					<label className="proyect-create-label">
						<span className="material-icons">{CREATE.FIELDS.PROJECT_NAME.ICON}</span>
						{CREATE.FIELDS.PROJECT_NAME.LABEL} *
					</label>

					<input className="proyect-create-input" value={form.ProjectName ?? ''} onChange={(e) => update('ProjectName')(e.target.value)} required />
				</div>

				{/* CLIENTE */}
				<div className="proyect-create-field">
					<label className="proyect-create-label">
						<span className="material-icons">business</span>
						Cliente
					</label>

					<input
						className="proyect-create-input"
						type="number"
						value={form.ClientId ?? ''}
						onChange={(e) => update('ClientId')(e.target.value ? Number(e.target.value) : null)}
					/>
				</div>

				{/* N° PROYECTO COMERCIAL */}
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

				{/* FECHA ALTA */}
				<div className="proyect-create-field">
					<label className="proyect-create-label">
						<span className="material-icons">{CREATE.FIELDS.REGISTRATION_DATE.ICON}</span>
						{CREATE.FIELDS.REGISTRATION_DATE.LABEL}
					</label>

					<input
						className="proyect-create-input"
						type="date"
						value={form.RegistrationDate ?? ''}
						onChange={(e) => update('RegistrationDate')(e.target.value || null)}
					/>
				</div>

				{/* CATEGORÍA */}
				<div className="proyect-create-field">
					<label className="proyect-create-label">
						<span className="material-icons">{CREATE.FIELDS.CATEGORY.ICON}</span>
						{CREATE.FIELDS.CATEGORY.LABEL}
					</label>

					<select className="proyect-create-select" value={form.CategoryCode ?? ''} onChange={(e) => update('CategoryCode')(e.target.value || null)}>
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

				{/* ESTADO */}
				<div className="proyect-create-field">
					<label className="proyect-create-label">
						<span className="material-icons">{CREATE.FIELDS.STATUS.ICON}</span>
						{CREATE.FIELDS.STATUS.LABEL}
					</label>

					<select className="proyect-create-select" value={form.ProjectStatusCode ?? ''} onChange={(e) => update('ProjectStatusCode')(e.target.value || null)}>
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

				{/* FECHA ESTADO NEGOCIO */}
				<div className="proyect-create-field">
					<label className="proyect-create-label">
						<span className="material-icons">today</span>
						Fecha estado negocio
					</label>

					<input
						className="proyect-create-input"
						type="date"
						value={form.BusinessStatusDate ?? ''}
						onChange={(e) => update('BusinessStatusDate')(e.target.value || null)}
					/>
				</div>

				{/* FECHA ESTIMADA FIN */}
				<div className="proyect-create-field">
					<label className="proyect-create-label">
						<span className="material-icons">event_available</span>
						Fecha estimada fin
					</label>

					<input
						className="proyect-create-input"
						type="date"
						value={form.EstimatedEndDate ?? ''}
						onChange={(e) => update('EstimatedEndDate')(e.target.value || null)}
					/>
				</div>

				{/* OBSERVACIONES */}
				<div className="proyect-create-field proyect-create-field--full">
					<label className="proyect-create-label">
						<span className="material-icons">{CREATE.FIELDS.OBSERVATIONS.ICON}</span>
						{CREATE.FIELDS.OBSERVATIONS.LABEL}
					</label>

					<textarea className="proyect-create-textarea" rows={3} value={form.Observations ?? ''} onChange={(e) => update('Observations')(e.target.value)} />
				</div>
			</div>

			{/* ================= ACTIONS ================= */}
			<div className="modal__actions">
				<button type="button" className="proyect-create-btn proyect-create-btn--cancel" onClick={closeCreate} data-tooltip={ACTIONS.CANCEL.TOOLTIP}>
					{ACTIONS.CANCEL.LABEL}
				</button>

				<button type="submit" className="proyect-create-btn proyect-create-btn--confirm" disabled={submitting} data-tooltip={ACTIONS.CONFIRM.TOOLTIP}>
					{ACTIONS.CONFIRM.LABEL}
				</button>
			</div>
		</form>
	)
}
