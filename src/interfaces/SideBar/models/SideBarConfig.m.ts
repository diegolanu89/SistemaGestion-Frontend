import { PROYECT_PATHS } from '../../Proyect/routes/paths'
import { ESTIMATED_PROJECT_PATHS } from '../../EstimatedProjects/routes/paths'

import { SideBarItem as SideBarItemType } from './SideBar.m'
import { DASHBOARD_HOURS_PATHS } from '../../DashboardHours/routes/paths'

export const SIDEBAR = {
	config: {
		drawerWidth: 260,
		title: '',
	},

	styles: {
		drawer: {
			width: 260,
			flexShrink: 0,

			'& .MuiDrawer-paper': {
				width: 260,
				backgroundColor: '#0f172a',
				color: '#fff',
			},
		},

		item: {
			py: 1,
			px: 2,
		},

		childList: {
			pl: 2,
		},

		collapse: {
			timeout: 'auto' as const,
			unmountOnExit: true,
		},
	},

	menu: [
		{
			label: 'Inicio',
			icon: 'home',
			path: '/',
		},

		{
			label: 'Operaciones',
			icon: 'build_circle',

			children: [
				{
					label: 'Asignación de Proyectos',
					icon: 'assignment_ind',
					path: '/operaciones/asignacion-proyectos',

					requiredPermission: 'PROJECTS_ASSIGN',
				},

				{
					label: 'Visualizar Proyectos',
					icon: 'visibility',
					path: '/operaciones/visualizar-proyectos',

					requiredPermission: 'PROJECTS_ACCESS',
				},

				{
					label: 'Carga de ETC a Proyecto',
					icon: 'edit_note',
					path: '/operaciones/carga-etc',

					requiredPermission: 'ETC_ACCESS',
				},

				{
					label: 'Alta de Proyectos Estimados',
					icon: 'post_add',
					path: ESTIMATED_PROJECT_PATHS.LIST,

					requiredPermission: 'ESTIMATED_PROJECTS_ACCESS',
				},
			],
		},

		{
			label: 'Análisis',
			icon: 'bar_chart',

			children: [
				{
					label: 'Dashboard EVM',
					icon: 'query_stats',
					path: '/analisis/dashboard-evm',

					requiredPermission: 'DASHBOARD_EVM_ACCESS',
				},

				{
					label: 'Dashboard Horas',
					icon: 'schedule',
					path: DASHBOARD_HOURS_PATHS.DASHBOARD_HOURS,

					requiredPermission: 'DASHBOARD_HOURS_ACCESS',
				},
			],
		},

		{
			label: 'Reportería',
			icon: 'summarize',

			children: [
				{
					label: 'Reportes',
					icon: 'description',
					path: '/reporteria/reportes',

					requiredPermission: 'REPORTS_ACCESS',
				},
			],
		},

		{
			label: 'Administración',
			icon: 'admin_panel_settings',

			children: [
				{
					label: 'Alta de proyectos',
					icon: 'add_circle',
					path: PROYECT_PATHS.PROYECT,

					requiredPermission: 'PROJECTS_CREATE',
				},
			],
		},

		{
			label: 'Configuración',
			icon: 'settings',

			children: [
				{
					label: 'Configuraciones',
					icon: 'tune',
					path: '/configuracion',

					requiredPermission: 'SETTINGS_ACCESS',
				},
			],
		},
	] as SideBarItemType[],
}
