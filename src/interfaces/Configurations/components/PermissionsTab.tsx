import { usePermissionTab } from '../hooks/usePermissionTab.h'
import { ClearFiltersButton } from '../../base/components/ClearFiltersButton/ClearFiltersButton'
import AssignProfileModal from './AssignProfileModal'
import ProfileFormModal from './ProfileFormModal'
import ProfilePermissionsModal from './ProfilePermissionModal'
import ProfilesTable from './ProfileTable'
import UsersTable from './UserTablePermissions'

const PermissionTab = () => {
	const controller = usePermissionTab()

	return (
		<div className="conf-tab">
			<div className="conf-tab__header">
				<h2 className="conf-tab__title">Administración de Perfiles</h2>

				<button className="proyect__add-btn" onClick={controller.openCreateProfile}>
					<span className="material-icons">add</span>
					<span>Nuevo Perfil</span>
				</button>
			</div>

			<p className="conf-tab__hint">
				Gestioná los perfiles de acceso y sus permisos. Asigná un perfil a cada usuario para controlar qué puede ver y hacer en el sistema.
			</p>

			{controller.error && <div className="conf-tab__error">{controller.error}</div>}

			<ProfilesTable
				profiles={controller.profiles}
				onViewPermissions={controller.openPermissions}
				onEditProfile={controller.openEditProfile}
				onDeleteProfile={(profile) => {
					void controller.handleDeleteProfile(profile)
				}}
			/>

			<div className="conf-tab__header" style={{ marginTop: 32 }}>
				<h2 className="conf-tab__title">Usuarios y Perfiles</h2>
			</div>

			<div className="conf-tab__filters">
				<div className="conf-tab__filter-group conf-tab__filter-group--search">
					<span className="conf-tab__filter-label">Buscar</span>
					<div className="conf-tab__search-wrapper">
						<span className="material-icons conf-tab__search-icon">search</span>
						<input
							type="text"
							className="conf-tab__search-input"
							placeholder="Nombre o correo..."
							value={controller.userSearch}
							onChange={(e) => controller.setUserSearch(e.target.value)}
						/>
					</div>
				</div>
				<ClearFiltersButton
					active={controller.userSearch.trim() !== ''}
					onClear={() => controller.setUserSearch('')}
					tooltip="Limpiar filtros"
				/>
			</div>

			<UsersTable users={controller.filteredUsers} onAssignProfile={controller.openAssignProfile} />

			{controller.showAssignProfileModal && controller.selectedUser && (
				<AssignProfileModal
					user={controller.selectedUser}
					profiles={controller.profiles.filter((profile) => profile.code !== 'ADMIN')}
					selectedProfileId={controller.selectedProfileId}
					onChangeProfile={controller.setSelectedProfileId}
					onClose={() => controller.setShowAssignProfileModal(false)}
					onSave={() => void controller.handleAssignProfile()}
				/>
			)}

			{controller.selectedProfile && (
				<ProfilePermissionsModal
					profile={controller.selectedProfile}
					permissions={controller.allPermissions}
					selectedPermissions={controller.selectedPermissions}
					loading={controller.loading}
					saving={controller.saving}
					onToggle={controller.togglePermission}
					onSave={() => void controller.handleSavePermissions()}
					onClose={() => controller.setSelectedProfile(null)}
				/>
			)}

			{controller.showProfileModal && (
				<ProfileFormModal
					editingProfile={controller.editingProfile}
					profileName={controller.profileName}
					profileCode={controller.profileCode}
					profileDescription={controller.profileDescription}
					onProfileNameChange={controller.setProfileName}
					onProfileCodeChange={controller.setProfileCode}
					onProfileDescriptionChange={controller.setProfileDescription}
					onSave={() => void controller.handleSaveProfile()}
					onClose={() => controller.setShowProfileModal(false)}
				/>
			)}
		</div>
	)
}

export default PermissionTab
