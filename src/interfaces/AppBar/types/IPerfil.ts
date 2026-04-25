import type { SvgIconComponent } from '@mui/icons-material'

/**
 * IPerfil
 *
 * Interface defining the configuration contract for the Perfil model.
 * It centralizes static UI texts and icons consumed by the PerfilController
 * and Perfil subcomponents.
 */
export interface IPerfil {
	TEXTS: {
		TITLE: string
		BUTTON_EDIT: string
		ALIAS_PREFIX: string

		EMAIL_VERIFIED: string
		EMAIL_NOT_VERIFIED: string
		MFA_ENABLED: string
		MFA_DISABLED: string

		ROLE: string
		CREATED_AT: string
		UPDATED_AT: string
		LAST_ACTIVITY: string
	}

	ICONS: {
		EMAIL_STATUS: SvgIconComponent
		MFA_STATUS: SvgIconComponent
		LAST_ACTIVITY: SvgIconComponent
	}
}
