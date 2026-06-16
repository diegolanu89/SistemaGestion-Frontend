import { PROYECT_PATHS } from '../../Proyect/routes/paths'
import { ESTIMATED_PROJECT_PATHS } from '../../EstimatedProjects/routes/paths'
import { DASHBOARD_HOURS_PATHS } from '../../DashboardHours/routes/paths'

import { SideBarItem as SideBarItemType } from './SideBar.m'
import { REPORTS_PATHS } from '../../reports/routes/paths'
import { ETC_LOAD_PROJECT } from '../../Etc/routes/paths'
import { PROYECT_PATHS_VIEWS } from '../../ViewProyect/routes/paths'
import { IDLE_PATHS } from '../../Idle/routes/paths'
import { PROJECT_ASSIGNMENT_PATHS } from '../../ProjectAsignament/routes/paths'
import { DASHBOARD_EVM_PATHS } from '../../DashboardEvm/routes/paths'
import { CONFIGURATIONS_PATHS } from '../../Configurations/routes/paths'

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
			activePaths: [IDLE_PATHS.HOME],
		},

		{
			label: 'Operaciones',
			icon: 'build_circle',

			children: [
				{
					label: 'Asignación de Proyectos',
					icon: 'assignment_ind',
					path: PROJECT_ASSIGNMENT_PATHS.PROJECT_ASSIGNMENT,

					requiredPermission: 'PROJECTS_ASSIGN',
				},

				{
					label: 'Visualización de proyectos',
					icon: 'visibility',
					path: PROYECT_PATHS_VIEWS.PROYECT_VIEW,
					activePaths: [PROYECT_PATHS_VIEWS.PROYECT_ITEM],

					requiredPermission: 'PROJECTS_ACCESS',
				},

				{
					label: 'Carga de ETC a Proyecto',
					icon: 'edit_note',
					path: ETC_LOAD_PROJECT.ETC_LOAD,
					activePaths: [ETC_LOAD_PROJECT.ETC_WEEKLY_VERSION],

					requiredPermission: 'ETC_ACCESS',
				},

				{
					label: 'Alta de Proyectos Estimados',
					icon: 'post_add',
					path: ESTIMATED_PROJECT_PATHS.LIST,
					activePaths: [ESTIMATED_PROJECT_PATHS.CREATE, ESTIMATED_PROJECT_PATHS.EDIT],

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
					path: DASHBOARD_EVM_PATHS.DASHBOARD,

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
					path: REPORTS_PATHS.DOTATION,

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
					path: CONFIGURATIONS_PATHS.LIST,

					requiredPermission: 'SETTINGS_ACCESS',
				},
			],
		},
	] as SideBarItemType[],
}
