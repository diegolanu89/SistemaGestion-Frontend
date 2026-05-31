import { useEffect, useState } from 'react'

import { AppUserDto } from '../models/AppUser.m'

import { PermissionDto, ProfileDto, ProfilePermissionItemDto, SyncProfilePermissionsDto, CreateProfileDto, UpdateProfileDto } from '../models/Permissions.m'

import { permissionBDT } from '../services/PermissionsBDT'

const ADMIN_ACTION_ID = 3

export const usePermissionTab = () => {
	const [users, setUsers] = useState<AppUserDto[]>([])

	const [selectedUser, setSelectedUser] = useState<AppUserDto | null>(null)

	const [selectedProfileId, setSelectedProfileId] = useState<number>(0)

	const [showAssignProfileModal, setShowAssignProfileModal] = useState(false)

	const [profiles, setProfiles] = useState<ProfileDto[]>([])

	const [allPermissions, setAllPermissions] = useState<PermissionDto[]>([])

	const [selectedProfile, setSelectedProfile] = useState<ProfileDto | null>(null)

	const [permissions, setPermissions] = useState<ProfilePermissionItemDto[]>([])

	const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])

	const [loading, setLoading] = useState(false)

	const [saving, setSaving] = useState(false)

	const [showProfileModal, setShowProfileModal] = useState(false)

	const [editingProfile, setEditingProfile] = useState<ProfileDto | null>(null)

	const [profileName, setProfileName] = useState('')

	const [profileCode, setProfileCode] = useState('')

	const [profileDescription, setProfileDescription] = useState('')

	const loadUsers = async () => {
		const response = await permissionBDT.listUsers()

		setUsers(response)
	}

	const loadProfiles = async () => {
		const response = await permissionBDT.listProfiles()

		setProfiles(response)
	}

	const loadAllPermissions = async () => {
		const response = await permissionBDT.listPermissions()

		setAllPermissions(response)
	}

	const loadPermissions = async (profileId: number) => {
		setLoading(true)

		try {
			const response = await permissionBDT.getProfilePermissions(profileId)

			setPermissions(response.permissions)

			setSelectedPermissions(response.permissions.map((permission) => permission.permissionCode))
		} finally {
			setLoading(false)
		}
	}

	const openAssignProfile = (user: AppUserDto) => {
		setSelectedUser(user)

		setSelectedProfileId(user.profileId ?? 0)

		setShowAssignProfileModal(true)
	}

	const handleAssignProfile = async () => {
		if (!selectedUser) {
			return
		}

		await permissionBDT.assignProfileToUser(selectedUser.id, selectedProfileId)

		setShowAssignProfileModal(false)

		setSelectedUser(null)

		await loadUsers()
	}

	const openPermissions = async (profile: ProfileDto) => {
		setSelectedProfile(profile)

		await loadPermissions(profile.id)
	}

	const togglePermission = (permissionCode: string) => {
		setSelectedPermissions((previous) =>
			previous.includes(permissionCode) ? previous.filter((permission) => permission !== permissionCode) : [...previous, permissionCode]
		)
	}

	const handleSavePermissions = async () => {
		if (!selectedProfile) {
			return
		}

		setSaving(true)

		try {
			const payload: SyncProfilePermissionsDto = {
				permissions: selectedPermissions
					.map((permissionCode) => {
						const permission = allPermissions.find((item) => item.code === permissionCode)

						if (!permission) {
							return null
						}

						return {
							permissionId: permission.id,
							actionId: ADMIN_ACTION_ID,
						}
					})
					.filter(
						(
							item
						): item is {
							permissionId: number
							actionId: number
						} => item !== null
					),
			}

			await permissionBDT.saveProfilePermissions(selectedProfile.id, payload)

			setSelectedProfile(null)

			await loadProfiles()
		} finally {
			setSaving(false)
		}
	}

	const openCreateProfile = () => {
		setEditingProfile(null)

		setProfileName('')

		setProfileCode('')

		setProfileDescription('')

		setShowProfileModal(true)
	}

	const openEditProfile = (profile: ProfileDto) => {
		setEditingProfile(profile)

		setProfileName(profile.name)

		setProfileCode(profile.code)

		setProfileDescription(profile.description ?? '')

		setShowProfileModal(true)
	}

	const handleSaveProfile = async () => {
		if (!profileName.trim()) {
			return
		}

		if (!editingProfile) {
			const payload: CreateProfileDto = {
				name: profileName.trim(),
				code: profileCode.trim().toUpperCase(),
				description: profileDescription.trim(),
			}

			await permissionBDT.createProfile(payload)
		} else {
			const payload: UpdateProfileDto = {
				name: profileName.trim(),
				description: profileDescription.trim(),
			}

			await permissionBDT.updateProfile(editingProfile.id, payload)
		}

		setShowProfileModal(false)

		setEditingProfile(null)

		setProfileName('')

		setProfileCode('')

		setProfileDescription('')

		await loadProfiles()
	}

	const handleDeleteProfile = async (profile: ProfileDto) => {
		if (profile.code === 'ADMIN') {
			return
		}

		await permissionBDT.deleteProfile(profile.id)

		await loadProfiles()
	}

	useEffect(() => {
		void loadUsers()

		void loadProfiles()

		void loadAllPermissions()
	}, [])

	return {
		users,
		profiles,
		allPermissions,

		permissions,

		selectedUser,
		selectedProfile,

		selectedProfileId,
		selectedPermissions,

		loading,
		saving,

		showAssignProfileModal,
		showProfileModal,

		editingProfile,

		profileName,
		profileCode,
		profileDescription,

		setSelectedProfileId,
		setShowAssignProfileModal,
		setSelectedProfile,

		setShowProfileModal,

		setProfileName,
		setProfileCode,
		setProfileDescription,

		openAssignProfile,
		openPermissions,
		openCreateProfile,
		openEditProfile,

		handleAssignProfile,
		handleSavePermissions,
		handleSaveProfile,
		handleDeleteProfile,

		loadUsers,
		loadProfiles,
		loadPermissions,

		togglePermission,
	}
}
