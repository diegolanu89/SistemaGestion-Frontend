import { AppUserDto } from '../models/AppUser.m'

interface Props {
	users: AppUserDto[]
	onAssignProfile: (user: AppUserDto) => void
}

const UsersTable = ({ users, onAssignProfile }: Props) => {
	return (
		<div className="conf-tab__table-wrapper">
			<table className="conf-tab__table">
				<thead>
					<tr>
						<th>Usuario</th>
						<th>Email</th>
						<th>Código</th>
						<th>Perfil</th>
						<th>Permisos</th>
						<th>Acciones</th>
					</tr>
				</thead>

				<tbody>
					{users.map((user) => (
						<tr key={user.id}>
							<td>{user.name}</td>

							<td>{user.email}</td>

							<td>
								{user.profileCode ? (
									<span className="profiles-table__code">{user.profileCode}</span>
								) : (
									'-'
								)}
							</td>

							<td>{user.profileName ?? '-'}</td>

							<td>
								<span className="conf-badge">{user.profileName ?? 'Sin Perfil'}</span>
							</td>

							<td>
								<button className="conf-btn conf-btn--secondary" onClick={() => onAssignProfile(user)}>
									<span className="material-icons" style={{ fontSize: 16 }}>assignment_ind</span>
									Asignar Perfil
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

export default UsersTable
