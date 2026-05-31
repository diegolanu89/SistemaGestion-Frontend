import { FaIdBadge, FaShieldAlt } from 'react-icons/fa'

import { ProfileDto } from '../models/Permissions.m'

interface Props {
	editingProfile: ProfileDto | null

	profileName: string
	profileCode: string
	profileDescription: string

	onProfileNameChange: (value: string) => void
	onProfileCodeChange: (value: string) => void
	onProfileDescriptionChange: (value: string) => void

	onSave: () => void
	onClose: () => void
}

const ProfileFormModal = ({
	editingProfile,
	profileName,
	profileCode,
	profileDescription,
	onProfileNameChange,
	onProfileCodeChange,
	onProfileDescriptionChange,
	onSave,
	onClose,
}: Props) => {
	return (
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal conf-modal--md profile-form-modal" onClick={(event) => event.stopPropagation()}>
				<div className="modal__header">
					<div className="profile-form-modal__title">
						<FaShieldAlt />

						<h2>{editingProfile ? 'Editar Perfil' : 'Nuevo Perfil'}</h2>
					</div>

					<button className="profile-form-modal__close" onClick={onClose}>
						×
					</button>
				</div>

				<div className="modal__body">
					<div className="profile-form-modal__info">Los perfiles permiten agrupar permisos y asignarlos a múltiples usuarios de manera centralizada.</div>

					<div className="profile-form-modal__form">
						<div className="profile-form-modal__field">
							<label>Nombre del Perfil</label>

							<input
								type="text"
								value={profileName}
								placeholder="Ej: Analista, Supervisor, PMO"
								onChange={(event) => onProfileNameChange(event.target.value)}
							/>
						</div>

						{!editingProfile && (
							<div className="profile-form-modal__field">
								<label>Código Interno</label>

								<div className="profile-form-modal__input-icon">
									<FaIdBadge />

									<input type="text" value={profileCode} placeholder="Ej: ANALISTA" onChange={(event) => onProfileCodeChange(event.target.value)} />
								</div>
							</div>
						)}

						<div className="profile-form-modal__field">
							<label>Descripción</label>

							<textarea
								rows={4}
								value={profileDescription}
								placeholder="Descripción funcional del perfil..."
								onChange={(event) => onProfileDescriptionChange(event.target.value)}
							/>
						</div>
					</div>
				</div>

				<div className="modal__actions">
					<button className="conf-btn conf-btn--secondary" onClick={onClose}>
						Cancelar
					</button>

					<button className="conf-btn conf-btn--primary" onClick={onSave} disabled={!profileName.trim() || (!editingProfile && !profileCode.trim())}>
						{editingProfile ? 'Actualizar Perfil' : 'Crear Perfil'}
					</button>
				</div>
			</div>
		</div>
	)
}

export default ProfileFormModal
