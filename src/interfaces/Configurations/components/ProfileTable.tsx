import { FaEye, FaPen, FaTrash, FaShieldAlt } from 'react-icons/fa'

import { ProfileDto } from '../models/Permissions.m'

interface Props {
	profiles: ProfileDto[]
	onViewPermissions: (profile: ProfileDto) => void
	onEditProfile: (profile: ProfileDto) => void
	onDeleteProfile: (profile: ProfileDto) => void
}

const ProfilesTable = ({ profiles, onViewPermissions, onEditProfile, onDeleteProfile }: Props) => {
	return (
		<div className="conf-tab__table-wrapper">
			<table className="conf-tab__table">
				<thead>
					<tr>
						<th>Nombre</th>
						<th>Código</th>
						<th>Descripción</th>
						<th>Permisos</th>
						<th>Acciones</th>
					</tr>
				</thead>

				<tbody>
					{profiles.length === 0 && (
						<tr>
							<td colSpan={5}>
								<div className="profiles-table__empty">No existen perfiles configurados.</div>
							</td>
						</tr>
					)}

					{profiles.map((profile) => (
						<tr key={profile.id}>
							<td>
								{profile.code === 'ADMIN' ? (
									<span className="profiles-table__admin-badge">
										<FaShieldAlt />
										&nbsp;{profile.name}
									</span>
								) : (
									profile.name
								)}
							</td>

							<td>
								<span className="profiles-table__code">{profile.code}</span>
							</td>

							<td>
								<div className="profiles-table__description">{profile.description ?? '-'}</div>
							</td>

							<td>
								<button className="conf-btn conf-btn--secondary" onClick={() => onViewPermissions(profile)}>
									<FaEye />
									&nbsp;Permisos
								</button>
							</td>

							<td>
								<div className="profiles-table__actions">
									{profile.code !== 'ADMIN' && (
										<>
											<button className="conf-btn conf-btn--secondary" onClick={() => onEditProfile(profile)}>
												<FaPen />
												&nbsp;Editar
											</button>

											<button className="conf-btn conf-btn--danger" onClick={() => onDeleteProfile(profile)}>
												<FaTrash />
												&nbsp;Eliminar
											</button>
										</>
									)}
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

export default ProfilesTable
