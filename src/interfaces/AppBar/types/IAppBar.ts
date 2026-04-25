export interface IAppBar {
	TITLE: string

	COLORS: {
		BACKGROUND: string
		TEXT: string
	}

	ROUTES: {
		NO_BACK: string[]
		HOME: string
	}

	LABELS: {
		PROFILE: string
		HOME: string
		LOGOUT: string
	}

	SHADOW?: boolean

	SESSION: {
		TIMEOUT_MS: number
	}
}
