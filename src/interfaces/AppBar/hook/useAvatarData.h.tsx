// src/interfaces/AppBar/hooks/useAvatarData.h.ts

import { useAuth } from '../../Login/hooks/useAuth.h'
import { AvatarController } from '../controllers/AvatarController.c'

export const useAvatarData = () => {
	const { user } = useAuth()

	const displayName = user?.name || user?.email || ''

	return {
		initials: AvatarController.obtenerIniciales(displayName),
		bgColor: AvatarController.stringToColor(displayName),
	}
}
