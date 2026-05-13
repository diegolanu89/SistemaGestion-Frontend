export interface SideBarItem {
	label: string
	icon: string
	path?: string
	requiredPermission?: string
	children?: SideBarItem[]
}
