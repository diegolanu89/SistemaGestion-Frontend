import { FaEye, FaShieldAlt } from 'react-icons/fa'

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
								{profile.description ?? '-'}
							</td>

							<td>
								<button className="conf-btn conf-btn--secondary" onClick={() => onViewPermissions(profile)}>
									<FaEye />
									&nbsp;Permisos
								</button>
							</td>

							<td>
								<div className="conf-tab__row-actions">
									{profile.code !== 'ADMIN' && (
										<>
											<button className="proyect-table__action proyect-table__action--edit" onClick={() => onEditProfile(profile)} data-tooltip="Editar">
												<span className="material-icons">edit</span>
											</button>

											<button className="proyect-table__action proyect-table__action--delete" onClick={() => onDeleteProfile(profile)} data-tooltip="Eliminar">
												<span className="material-icons">delete</span>
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
