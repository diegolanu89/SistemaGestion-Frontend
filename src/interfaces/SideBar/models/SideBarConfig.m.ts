import { PROYECT_PATHS } from '../../Proyect/routes/paths'
import { SideBarItem as SideBarItemType } from './SideBar.m'

export const SIDEBAR = {
	config: {
		drawerWidth: 260,
		title: 'Menú',
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
			label: 'Operaciones',
			icon: 'build_circle',
			children: [
				{
					label: 'Asignación de Proyectos',
					icon: 'assignment_ind',
					path: '/operaciones/asignacion-proyectos',
				},
				{
					label: 'Visualizar Proyectos',
					icon: 'visibility',
					path: '/operaciones/visualizar-proyectos',
				},
				{
					label: 'Carga de ETC a Proyecto',
					icon: 'edit_note',
					path: '/operaciones/carga-etc',
				},
				{
					label: 'Alta de Proyectos Estimados',
					icon: 'post_add',
					path: '/operaciones/proyectos-estimados',
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
				},
				{
					label: 'Dashboard Horas',
					icon: 'schedule',
					path: '/analisis/dashboard-horas',
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
				},
			],
		},
	] as SideBarItemType[],
}
