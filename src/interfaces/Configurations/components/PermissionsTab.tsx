import { usePermissionTab } from '../hooks/usePermissionTab.h'
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
				<h2 className="conf-tab__title">Usuarios y Perfiles</h2>
			</div>

			<UsersTable users={controller.users} onAssignProfile={controller.openAssignProfile} />

			<div className="conf-tab__header" style={{ marginTop: 40 }}>
				<h2 className="conf-tab__title">Administración de Perfiles</h2>

				<button className="conf-btn conf-btn--primary" onClick={controller.openCreateProfile}>
					Nuevo Perfil
				</button>
			</div>

			<ProfilesTable
				profiles={controller.profiles}
				onViewPermissions={controller.openPermissions}
				onEditProfile={controller.openEditProfile}
				onDeleteProfile={(profile) => {
					void controller.handleDeleteProfile(profile)
				}}
			/>

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
