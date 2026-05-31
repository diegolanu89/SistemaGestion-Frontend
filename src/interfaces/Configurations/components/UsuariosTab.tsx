import React, { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { appUsersBDT } from '../services/AppUsersBDT'
import type { AppUserDto, ProfileDto } from '../models/AppUser.m'
import { ClearFiltersButton } from '../../base/components/ClearFiltersButton/ClearFiltersButton'

const UsuariosTab: React.FC = () => {
	const [users, setUsers] = useState<AppUserDto[]>([])
	const [profiles, setProfiles] = useState<ProfileDto[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [formError, setFormError] = useState<string | null>(null)
	const [showDeleteModal, setShowDeleteModal] = useState(false)
	const [itemToDelete, setItemToDelete] = useState<AppUserDto | null>(null)
	const [deleting, setDeleting] = useState(false)
	const [search, setSearch] = useState('')
	const [filterProfileId, setFilterProfileId] = useState<number | ''>('')
	const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
	const [showModal, setShowModal] = useState(false)
	const [editingId, setEditingId] = useState<number | null>(null)
	const [saving, setSaving] = useState(false)

	const [formName, setFormName] = useState('')
	const [formEmail, setFormEmail] = useState('')
	const [formPassword, setFormPassword] = useState('')
	const [formPasswordConfirm, setFormPasswordConfirm] = useState('')
	const [formProfileId, setFormProfileId] = useState<number | ''>('')
	const [formActive, setFormActive] = useState(true)

	const loadProfiles = async () => {
		try {
			const profilesRes = await appUsersBDT.listProfiles()
			setProfiles(profilesRes)
		} catch (err) {
			console.error('Error cargando perfiles', err)
		}
	}

	const loadUsers = async (searchOverride?: string) => {
		setLoading(true)
		setError(null)
		const q = searchOverride !== undefined ? searchOverride : search
		try {
			const usersRes = await appUsersBDT.listUsers({ search: q.trim() || undefined })
			setUsers(usersRes)
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'Error al cargar los datos')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		void loadProfiles()
		void loadUsers()
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	const filteredUsers = useMemo(() => {
		return users.filter((u) => {
			if (filterProfileId !== '' && u.profileId !== filterProfileId) return false
			if (filterStatus === 'active' && !u.active) return false
			if (filterStatus === 'inactive' && u.active) return false
			return true
		})
	}, [users, filterProfileId, filterStatus])

	const openAdd = () => {
		setEditingId(null)
		setFormName('')
		setFormEmail('')
		setFormPassword('')
		setFormPasswordConfirm('')
		setFormProfileId('')
		setFormActive(true)
		setFormError(null)
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
		setFormError(null)
		setShowModal(true)
	}

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault()
		if (formPassword && formPassword !== formPasswordConfirm) {
			setFormError('Las contraseñas no coinciden')
			return
		}

		if (formProfileId === '') {
			setFormError('Debe seleccionar un perfil')
			return
		}

		setFormError(null)
		setSaving(true)
		try {
			if (editingId) {
				const payload: Parameters<typeof appUsersBDT.update>[1] = {
					name: formName.trim(),
					profileId: formProfileId,
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
					profileId: formProfileId,
					active: formActive,
				})
			}
			await loadUsers()
			setShowModal(false)
		} catch (err: unknown) {
			setFormError(err instanceof Error ? err.message : 'Error al guardar')
		} finally {
			setSaving(false)
		}
	}

	const requestDelete = (u: AppUserDto) => {
		setItemToDelete(u)
		setShowDeleteModal(true)
	}

	const confirmDelete = async () => {
		if (!itemToDelete) return
		setDeleting(true)
		setError(null)
		try {
			await appUsersBDT.remove(itemToDelete.id)
			setShowDeleteModal(false)
			setItemToDelete(null)
			await loadUsers()
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'Error al eliminar')
			setShowDeleteModal(false)
		} finally {
			setDeleting(false)
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

			<p className="conf-tab__hint">Alta, baja y modificación de personas (usuarios con login). Asigná un perfil a cada usuario.</p>

			{error && <div className="conf-tab__error">{error}</div>}

			<div className="conf-tab__filters">
				<div className="conf-tab__filter-group conf-tab__filter-group--search">
					<span className="conf-tab__filter-label">Buscar</span>
					<div className="conf-tab__search-wrapper">
						<span className="material-icons conf-tab__search-icon">search</span>
						<input
							type="text"
							className="conf-tab__search-input"
							placeholder="Nombre o correo..."
							value={search}
							onChange={(e) => {
								setSearch(e.target.value)
								void loadUsers(e.target.value)
							}}
						/>
					</div>
				</div>
				<div className="conf-tab__filter-group">
					<span className="conf-tab__filter-label">Perfil</span>
					<select
						className="conf-tab__filter-select"
						value={filterProfileId}
						onChange={(e) => setFilterProfileId(e.target.value ? Number(e.target.value) : '')}
					>
						<option value="">Todos</option>
						{profiles.map((p) => (
							<option key={p.id} value={p.id}>
								{p.name}
							</option>
						))}
					</select>
				</div>
				<div className="conf-tab__filter-group">
					<span className="conf-tab__filter-label">Estado</span>
					<select className="conf-tab__filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}>
						<option value="all">Todos</option>
						<option value="active">Activo</option>
						<option value="inactive">Inactivo</option>
					</select>
				</div>
				<ClearFiltersButton
					active={search.trim() !== '' || filterProfileId !== '' || filterStatus !== 'all'}
					onClear={() => {
						setSearch('')
						setFilterProfileId('')
						setFilterStatus('all')
						void loadUsers('')
					}}
					tooltip="Limpiar filtros"
				/>
			</div>

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
							{filteredUsers.length === 0 ? (
								<tr>
									<td colSpan={5} style={{ textAlign: 'center', padding: 40 }}>
										{users.length === 0 ? 'No hay usuarios. Usá "Alta de usuario" para agregar personas.' : 'No hay usuarios que coincidan con los filtros.'}
									</td>
								</tr>
							) : (
								filteredUsers.map((u) => (
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
												<button className="proyect-table__action proyect-table__action--delete" onClick={() => requestDelete(u)} data-tooltip="Eliminar">
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
					<form className="modal conf-modal--sm" onClick={(e) => e.stopPropagation()} onSubmit={(e) => void handleSave(e)}>
						<div className="modal__header">
							<h2>{editingId ? 'Editar usuario' : 'Alta de usuario'}</h2>
							<button type="button" onClick={() => setShowModal(false)}>
								×
							</button>
						</div>
						<div className="modal__body">
							<div className="conf-form">
								<div className="conf-form__group">
									<label className="conf-form__label">Nombre *</label>
									<input
										type="text"
										className="conf-form__input"
										value={formName}
										onChange={(e) => setFormName(e.target.value)}
										placeholder="Nombre completo"
										required
									/>
								</div>
								<div className="conf-form__group">
									<label className="conf-form__label">Correo *</label>
									<input
										type="email"
										className="conf-form__input"
										value={formEmail}
										onChange={(e) => setFormEmail(e.target.value)}
										placeholder="usuario@ejemplo.com"
										disabled={!!editingId}
										required={!editingId}
									/>
								</div>
								<div className="conf-form__group">
									<label className="conf-form__label">Contraseña {editingId ? '(dejar en blanco para no cambiar)' : '*'}</label>
									<input
										type="password"
										className="conf-form__input"
										value={formPassword}
										onChange={(e) => setFormPassword(e.target.value)}
										placeholder={editingId ? '••••••••' : 'Mínimo 8 caracteres'}
										required={!editingId}
										minLength={!editingId ? 8 : undefined}
									/>
								</div>
								{(!editingId || formPassword) && (
									<div className="conf-form__group">
										<label className="conf-form__label">Confirmar contraseña *</label>
										<input
											type="password"
											className="conf-form__input"
											value={formPasswordConfirm}
											onChange={(e) => setFormPasswordConfirm(e.target.value)}
											placeholder="••••••••"
											required
										/>
									</div>
								)}
								<div className="conf-form__group">
									<label className="conf-form__label">Perfil</label>
									<select
										className="conf-form__select"
										value={formProfileId === '' ? '' : formProfileId}
										onChange={(e) => setFormProfileId(e.target.value === '' ? '' : Number(e.target.value))}
									>
										<option value="">Sin perfil</option>
										{profiles.map((p) => (
											<option key={p.id} value={p.id}>
												{p.name} ({p.code})
											</option>
										))}
									</select>
								</div>
								<div className="conf-form__group">
									<label className="conf-form__checkbox-label">
										<input type="checkbox" checked={formActive} onChange={(e) => setFormActive(e.target.checked)} />
										Usuario activo
									</label>
								</div>
								{formError && <div className="conf-tab__error">{formError}</div>}
							</div>
						</div>
						<div className="modal__actions">
							<button type="button" className="conf-btn conf-btn--secondary" onClick={() => setShowModal(false)}>
								Cancelar
							</button>
							<button type="submit" className="conf-btn conf-btn--primary" disabled={saving}>
								{saving ? 'Guardando...' : 'Guardar'}
							</button>
						</div>
					</form>
				</div>
			)}
			{createPortal(
				<AnimatePresence>
					{showDeleteModal && itemToDelete && (
						<motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
							<motion.div
								className="proyect-delete-modal"
								initial={{ scale: 0.94, opacity: 0, y: 10 }}
								animate={{ scale: 1, opacity: 1, y: 0 }}
								exit={{ scale: 0.94, opacity: 0, y: 10 }}
								transition={{ type: 'spring', stiffness: 280, damping: 22 }}
							>
								<div className="proyect-delete-modal__header">
									<span className="material-icons">report_problem</span>
									<h2>Eliminar usuario</h2>
								</div>
								<div className="proyect-delete-modal__content">
									<p>Vas a eliminar:</p>
									<p className="proyect-delete-modal__project">{itemToDelete.name}</p>
									<div className="proyect-delete-modal__warning">
										<span className="material-icons">warning</span>
										<span>Esta acción es irreversible</span>
									</div>
								</div>
								<div className="proyect-delete-modal__actions">
									<button className="proyect-delete-btn proyect-delete-btn--cancel" onClick={() => setShowDeleteModal(false)} disabled={deleting}>
										Cancelar
									</button>
									<button className="proyect-delete-btn proyect-delete-btn--confirm" onClick={() => void confirmDelete()} disabled={deleting}>
										{deleting ? 'Eliminando...' : 'Eliminar'}
									</button>
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

export default UsuariosTab
