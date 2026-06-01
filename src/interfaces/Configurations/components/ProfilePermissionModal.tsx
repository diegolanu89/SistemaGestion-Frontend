import { PermissionDto, ProfileDto } from '../models/Permissions.m'

interface Props {
	profile: ProfileDto
	permissions: PermissionDto[]
	selectedPermissions: string[]
	loading: boolean
	saving: boolean
	onToggle: (permissionCode: string) => void
	onSave: () => void
	onClose: () => void
}

const ProfilePermissionsModal = ({ profile, permissions, selectedPermissions, loading, saving, onToggle, onSave, onClose }: Props) => {
	return (
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal conf-modal--lg" onClick={(event) => event.stopPropagation()}>
				<div className="modal__header">
					<h2>Permisos de {profile.name}</h2>

					<button onClick={onClose}>×</button>
				</div>

				<div className="modal__body">
					{loading ? (
						<p>Cargando...</p>
					) : (
						<div
							style={{
								display: 'grid',
								gap: 12,
							}}
						>
							{permissions.map((permission) => {
								const assigned = selectedPermissions.includes(permission.code)

								return (
									<label
										key={permission.id}
										style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: profile.code === 'ADMIN' ? 'default' : 'pointer' }}
									>
										<input
											type="checkbox"
											checked={assigned}
											disabled={profile.code === 'ADMIN'}
											onChange={() => onToggle(permission.code)}
											style={{ marginTop: 3, flexShrink: 0 }}
										/>
										<span>
											<span style={{ fontWeight: 500 }}>{permission.code}</span>
											{permission.description && (
												<span style={{ color: 'var(--color-text-secondary)', fontSize: 13, marginLeft: 8 }}>
													— {permission.description}
												</span>
											)}
										</span>
									</label>
								)
							})}
						</div>
					)}
				</div>

				<div className="modal__actions">
					<button className="conf-btn conf-btn--secondary" onClick={onClose}>
						Cancelar
					</button>

					{profile.code !== 'ADMIN' && (
						<button className="conf-btn conf-btn--primary" onClick={onSave} disabled={saving}>
							{saving ? 'Guardando...' : 'Guardar cambios'}
						</button>
					)}
				</div>
			</div>
		</div>
	)
}

export default ProfilePermissionsModal
