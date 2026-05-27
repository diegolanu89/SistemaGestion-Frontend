import React, { useEffect, useState } from 'react'
import { appUsersBDT } from '../services/AppUsersBDT'
import type { AppUserDto, ProfileDto } from '../models/AppUser.m'

const UsuariosTab: React.FC = () => {
	const [users, setUsers] = useState<AppUserDto[]>([])
	const [profiles, setProfiles] = useState<ProfileDto[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [showModal, setShowModal] = useState(false)
	const [editingId, setEditingId] = useState<number | null>(null)
	const [saving, setSaving] = useState(false)

	const [formName, setFormName] = useState('')
	const [formEmail, setFormEmail] = useState('')
	const [formPassword, setFormPassword] = useState('')
	const [formPasswordConfirm, setFormPasswordConfirm] = useState('')
	const [formProfileId, setFormProfileId] = useState<number | ''>('')
	const [formActive, setFormActive] = useState(true)

	const loadData = async () => {
		setLoading(true)
		setError(null)
		try {
			const [usersRes, profilesRes] = await Promise.all([appUsersBDT.listUsers(), appUsersBDT.listProfiles()])
			setUsers(usersRes)
			setProfiles(profilesRes)
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'Error al cargar los datos')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => { loadData() }, [])

	const openAdd = () => {
		setEditingId(null)
		setFormName('')
		setFormEmail('')
		setFormPassword('')
		setFormPasswordConfirm('')
		setFormProfileId('')
		setFormActive(true)
		setShowModal(true)
	}

	const openEdit = (u: AppUserDto) => {
		setEditingId(u.id)
		setFormName(u.name)
		setFormEmail(u.email)
		setFormPassword('')
		setFormPasswordConfirm('')
		setFormProfileId(u.profileId ?? '')
		setFormActive(u.active)
		setShowModal(true)
	}

	const handleSave = async () => {
		if (!formName.trim()) { setError('El nombre es obligatorio'); return }
		if (!formEmail.trim()) { setError('El correo es obligatorio'); return }
		if (!editingId && (!formPassword || formPassword.length < 8)) { setError('La contraseña debe tener al menos 8 caracteres'); return }
		if (!editingId && formPassword !== formPasswordConfirm) { setError('Las contraseñas no coinciden'); return }
		if (editingId && formPassword && formPassword !== formPasswordConfirm) { setError('Las contraseñas no coinciden'); return }

		setError(null)
		setSaving(true)
		try {
			if (editingId) {
				const payload: Parameters<typeof appUsersBDT.update>[1] = {
					name: formName.trim(),
					profileId: formProfileId === '' ? null : (formProfileId as number),
					active: formActive,
				}
				if (formPassword) {
					payload.password = formPassword
					payload.passwordConfirmation = formPasswordConfirm
				}
				await appUsersBDT.update(editingId, payload)
			} else {
				await appUsersBDT.create({
					name: formName.trim(),
					email: formEmail.trim(),
					password: formPassword,
					passwordConfirmation: formPasswordConfirm,
					profileId: formProfileId === '' ? null : (formProfileId as number),
					active: formActive,
				})
			}
			await loadData()
			setShowModal(false)
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'Error al guardar')
		} finally {
			setSaving(false)
		}
	}

	const handleDelete = async (u: AppUserDto) => {
		if (!window.confirm(`¿Eliminar al usuario "${u.name}"?`)) return
		setError(null)
		try {
			await appUsersBDT.remove(u.id)
			await loadData()
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'Error al eliminar')
		}
	}

	return (
		<div className="conf-tab">
			<div className="conf-tab__header">
				<h2 className="conf-tab__title">Usuarios del sistema</h2>
				<button className="proyect__add-btn" onClick={openAdd}>
					<span className="material-icons">add</span>
					<span>Alta de usuario</span>
				</button>
			</div>

			<p className="conf-tab__hint">
				Alta, baja y modificación de personas (usuarios con login). Asigná un perfil a cada usuario.
			</p>

			{error && <div className="conf-tab__error">{error}</div>}

			{loading && !users.length ? (
				<div className="conf-tab__loading">Cargando...</div>
			) : (
				<div className="conf-tab__table-wrapper">
					<table className="conf-tab__table">
						<thead>
							<tr>
								<th>Nombre</th>
								<th>Correo</th>
								<th>Perfil</th>
								<th>Estado</th>
								<th>Acciones</th>
							</tr>
						</thead>
						<tbody>
							{users.length === 0 ? (
								<tr><td colSpan={5} style={{ textAlign: 'center', padding: 40 }}>No hay usuarios. Usá &quot;Alta de usuario&quot; para agregar personas.</td></tr>
							) : (
								users.map((u) => (
									<tr key={u.id}>
										<td>{u.name}</td>
										<td>{u.email}</td>
										<td>{u.profileName ?? '-'}</td>
										<td>{u.active ? 'Activo' : 'Inactivo'}</td>
										<td>
											<div className="conf-tab__row-actions">
												<button className="proyect-table__action proyect-table__action--edit" onClick={() => openEdit(u)} data-tooltip="Editar">
													<span className="material-icons">edit</span>
												</button>
												<button className="proyect-table__action proyect-table__action--delete" onClick={() => handleDelete(u)} data-tooltip="Eliminar">
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
					<div className="modal conf-modal--sm" onClick={(e) => e.stopPropagation()}>
						<div className="modal__header">
							<h2>{editingId ? 'Editar usuario' : 'Alta de usuario'}</h2>
							<button onClick={() => setShowModal(false)}>×</button>
						</div>
						<div className="modal__body">
							<div className="conf-form">
								<div className="conf-form__group">
									<label className="conf-form__label">Nombre *</label>
									<input type="text" className="conf-form__input" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Nombre completo" />
								</div>
								<div className="conf-form__group">
									<label className="conf-form__label">Correo *</label>
									<input type="email" className="conf-form__input" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="usuario@ejemplo.com" disabled={!!editingId} />
								</div>
								<div className="conf-form__group">
									<label className="conf-form__label">
										Contraseña {editingId ? '(dejar en blanco para no cambiar)' : '*'}
									</label>
									<input type="password" className="conf-form__input" value={formPassword} onChange={(e) => setFormPassword(e.target.value)} placeholder={editingId ? '••••••••' : 'Mínimo 8 caracteres'} />
								</div>
								{(!editingId || formPassword) && (
									<div className="conf-form__group">
										<label className="conf-form__label">Confirmar contraseña *</label>
										<input type="password" className="conf-form__input" value={formPasswordConfirm} onChange={(e) => setFormPasswordConfirm(e.target.value)} placeholder="••••••••" />
									</div>
								)}
								<div className="conf-form__group">
									<label className="conf-form__label">Perfil</label>
									<select className="conf-form__select" value={formProfileId === '' ? '' : formProfileId} onChange={(e) => setFormProfileId(e.target.value === '' ? '' : Number(e.target.value))}>
										<option value="">Sin perfil</option>
										{profiles.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.code})</option>)}
									</select>
								</div>
								<div className="conf-form__group">
									<label className="conf-form__checkbox-label">
										<input type="checkbox" checked={formActive} onChange={(e) => setFormActive(e.target.checked)} />
										Usuario activo
									</label>
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

export default UsuariosTab
