import BDT from '../../../images/brandt/bdt.png'

export class Feature {
	static GRID = {
		HEADER: {
			TITLE: 'Panel de acceso',
			DESCRIPTION: 'Seleccioná un módulo para continuar',
			ICON: BDT,
			ICON_ALT: 'TrackFit Logo',
		},

		LAYOUT: {
			GAP: 16,
			MAX_WIDTH: 720,
			PADDING_Y: 48,
		},

		ACTIONS: [
			{
				id: 'dashboard',
				label: 'Dashboard',
				icon: BDT,
				route: '/dashboard',
				roles: ['admin', 'user'],
			},
			{
				id: 'projects',
				label: 'Proyectos',
				icon: BDT,
				route: '/projects',
				roles: ['admin'],
			},
		],
	}
}
