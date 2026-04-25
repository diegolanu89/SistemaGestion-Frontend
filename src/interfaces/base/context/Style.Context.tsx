// src/theme/themes.ts
import { createTheme } from '@mui/material/styles'

export const styleLight = createTheme({
	palette: {
		mode: 'light',
		primary: {
			main: '#1976d2',
		},
		background: {
			default: '#f5f5f5',
			paper: '#ffffff',
		},
	},
})

/**
 * 🌙 Tema oscuro general (base Material UI)
 *
 * Define una paleta oscura con colores `primary` y `secondary` personalizados.
 * Puede usarse como tema base para aplicaciones con modo oscuro tradicional.
 *
 * Ejemplo de uso:
 * ```tsx
 * <ThemeProvider theme={styleDark}>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export const styleDark = createTheme({
	palette: {
		mode: 'dark',
		primary: { light: '#FF8A50', main: '#FF5722', dark: '#D84315' },
		secondary: { light: '#52c7b8', main: '#009688', dark: '#00675b' },
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				body: {
					scrollbarWidth: 'thin',
					scrollbarColor: '#5a5a5a transparent',
				},
				'*::-webkit-scrollbar': {
					width: 10,
					height: 10,
				},
				'*::-webkit-scrollbar-track': {
					background: 'transparent',
				},
				'*::-webkit-scrollbar-thumb': {
					backgroundColor: 'rgba(255,255,255,0.22)',
					borderRadius: 999,
					border: '2px solid transparent',
					backgroundClip: 'content-box',
				},
				'*::-webkit-scrollbar-thumb:hover': {
					backgroundColor: 'rgba(255,255,255,0.35)',
				},
			},
		},
	},
})

export const styleTrainning = createTheme({
	palette: {
		mode: 'dark', // Habilita el modo oscuro de MUI
		primary: {
			light: '#FFD54F', // amarillo claro
			main: '#FFC107', // amarillo fuerte (logo)
			dark: '#FFA000', // amarillo profundo
		},
		secondary: {
			light: '#52c7b8', // Verde agua claro
			main: '#009688', // Verde agua principal
			dark: '#00675b', // Verde agua oscuro
		},
	},
})

export const styleEvents = createTheme({
	palette: {
		mode: 'dark', // Habilita el modo oscuro de MUI
		primary: {
			light: '#64B5F6', // azul claro
			main: '#2196F3', // azul principal (logo)
			dark: '#1976D2', // azul profundo
		},
		secondary: {
			light: '#52c7b8', // Verde agua claro
			main: '#009688', // Verde agua principal
			dark: '#00675b', // Verde agua oscuro
		},
	},
})

/**
 * 🌍 Tema Travel
 *
 * Base dark + identidad viajera:
 * - Azules profundos con matiz violáceo
 * - Sensación nocturna / mapas / itinerarios
 * - Compatible con cards, timelines y chips
 */
export const styleTravel = createTheme({
	palette: {
		mode: 'dark',

		primary: {
			light: '#8E99F3', // azul violáceo claro
			main: '#5C6BC0', // índigo viajero (Material Indigo 400)
			dark: '#3949AB', // índigo profundo
		},

		secondary: {
			light: '#4FC3F7', // azul cielo
			main: '#0288D1', // azul mapa / agua
			dark: '#01579B', // azul profundo
		},

		info: {
			main: '#29B6F6', // info / links / mapas
		},

		warning: {
			main: '#F97316', // lo dejamos amarillo para “hoy / atención”
		},

		success: {
			main: '#66BB6A',
		},

		background: {
			default: '#0E1117', // un pelín más frío que el dark base
			paper: '#161B22',
		},
	},

	components: {
		MuiCssBaseline: {
			styleOverrides: {
				body: {
					scrollbarWidth: 'thin',
					scrollbarColor: '#5a5a5a transparent',
				},
				'*::-webkit-scrollbar': {
					width: 10,
					height: 10,
				},
				'*::-webkit-scrollbar-track': {
					background: 'transparent',
				},
				'*::-webkit-scrollbar-thumb': {
					backgroundColor: 'rgba(255,255,255,0.22)',
					borderRadius: 999,
					border: '2px solid transparent',
					backgroundClip: 'content-box',
				},
				'*::-webkit-scrollbar-thumb:hover': {
					backgroundColor: 'rgba(255,255,255,0.35)',
				},
			},
		},

		// Pequeños ajustes que quedan hermosos en Travel
		MuiCard: {
			styleOverrides: {
				root: {
					borderRadius: 14,
				},
			},
		},

		MuiChip: {
			styleOverrides: {
				root: {
					fontWeight: 600,
				},
			},
		},
	},
})
