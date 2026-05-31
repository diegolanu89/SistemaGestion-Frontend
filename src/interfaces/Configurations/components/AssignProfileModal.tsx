import { FaUserShield, FaUserTag } from 'react-icons/fa'

import { AppUserDto } from '../models/AppUser.m'
import { ProfileDto } from '../models/Permissions.m'

interface Props {
	user: AppUserDto
	profiles: ProfileDto[]
	selectedProfileId: number
	onChangeProfile: (profileId: number) => void
	onClose: () => void
	onSave: () => void
}

const AssignProfileModal = ({ user, profiles, selectedProfileId, onChangeProfile, onClose, onSave }: Props) => {
	return (
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal conf-modal--md assign-profile-modal" onClick={(event) => event.stopPropagation()}>
				<div className="modal__header">
					<div className="assign-profile-modal__title">
						<FaUserShield />

						<h2>Asignar Perfil</h2>
					</div>

					<button className="assign-profile-modal__close" onClick={onClose}>
						×
					</button>
				</div>

				<div className="modal__body">
					<div className="assign-profile-modal__user">
						<div className="assign-profile-modal__icon">
							<FaUserTag />
						</div>

						<div>
							<span className="assign-profile-modal__label">Usuario seleccionado</span>

							<strong>{user.name}</strong>

							<small>{user.email}</small>
						</div>
					</div>

					<div className="assign-profile-modal__info">
						Seleccione el perfil que determinará los permisos y accesos disponibles para este usuario dentro del sistema.
					</div>

					<div className="assign-profile-modal__field">
						<label>Perfil</label>

						<select value={selectedProfileId} onChange={(event) => onChangeProfile(Number(event.target.value))}>
							<option value={0}>Seleccionar perfil</option>

							{profiles.map((profile) => (
								<option key={profile.id} value={profile.id}>
									{profile.name}
								</option>
							))}
						</select>
					</div>
				</div>

				<div className="modal__actions">
					<button className="conf-btn conf-btn--secondary" onClick={onClose}>
						Cancelar
					</button>

					<button className="conf-btn conf-btn--primary" onClick={onSave} disabled={selectedProfileId === 0}>
						Guardar Asignación
					</button>
				</div>
			</div>
		</div>
	)
}

export default AssignProfileModal
