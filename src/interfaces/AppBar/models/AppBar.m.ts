// src/interfaces/AppBar/models/AppBar.m.ts

import { IAppBar } from '../types/IAppBar'

export const AppBar: IAppBar = {
	TITLE: 'PRODE',

	COLORS: {
		BACKGROUND: 'linear-gradient(90deg, #ECECEC 0%, #F6F6F6 100%)',
		TEXT: '#333',
	},

	ROUTES: {
		NO_BACK: ['/', '/login', '/home'],
		HOME: '/',
	},

	LABELS: {
		PROFILE: 'Rol',
		HOME: 'Inicio',
		LOGOUT: 'Cerrar sesión',
	},

	SHADOW: true,

	// ✅ NUEVO: configuración de sesión
	SESSION: {
		TIMEOUT_MS: 15 * 60 * 1000, // 15 minutos
	},
}
