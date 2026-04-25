import BDT from '../../../images/brandt/bdt.png'

export const Login = {
	TEXTS: {
		TITLE_LOGIN: 'Iniciar sesión',

		EMAIL_LABEL: 'Correo electrónico',
		PASSWORD_LABEL: 'Contraseña',

		BUTTON_LOGIN: 'Entrar',
		BUTTON_LOADING: 'Procesando...',

		ERROR_INVALID: 'Email o contraseña incorrectos.',
	},

	STYLES: {
		MAX_WIDTH: 400,
	},

	IMAGES: {
		LOGO: BDT,
		LOGO_ALT: 'TrackFit',
	},

	// ==========================
	// ANIMATIONS
	// ==========================
	ANIMATIONS: {
		ENABLED: true, // 🔥 ON / OFF GLOBAL

		OVERLAY: {
			SCALE: 30,
			OPACITY: 1,
			DURATION: 0.8,
		},

		TEXT: {
			INITIAL_Y: -20,
			INITIAL_OPACITY: 0,
			DURATION: 0.3,
		},
	},
} as const
