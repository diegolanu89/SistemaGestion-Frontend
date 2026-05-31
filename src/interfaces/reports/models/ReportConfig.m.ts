import { REPORTS_PATHS } from '../routes/paths'

export const REPORTS_CONFIG = {
	cards: [
		{
			id: 'dotation',
			title: 'Generación de Dotación',
			description: 'Exporta el reporte de time entries por rango de fechas.',
			icon: 'groups',
			path: REPORTS_PATHS.DOTATION,
		},

		{
			id: 'export',
			title: 'Exportación',
			description: 'Exporta información consolidada para análisis externos.',
			icon: 'download',
			path: REPORTS_PATHS.EXPORT,
		},
	],
}
