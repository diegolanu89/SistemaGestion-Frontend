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
				{ label: 'Asignación de Proyectos', icon: 'assignment_ind' },
				{ label: 'Visualizar Proyectos', icon: 'visibility' },
			],
		},
		{
			label: 'Análisis',
			icon: 'bar_chart',
			children: [
				{ label: 'Dashboard EVM', icon: 'query_stats' },
				{ label: 'Dashboard Horas', icon: 'schedule' },
			],
		},
		{
			label: 'Reportería',
			icon: 'summarize',
			children: [{ label: 'Reportes', icon: 'description' }],
		},
		{
			label: 'Administración',
			icon: 'admin_panel_settings',
			children: [{ label: 'Alta de proyectos', icon: 'add_circle' }],
		},
		{
			label: 'Configuración',
			icon: 'settings',
			children: [{ label: 'Configuraciones', icon: 'tune' }],
		},
	] as SideBarItemType[],
}
