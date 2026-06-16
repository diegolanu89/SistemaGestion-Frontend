export interface SideBarItem {
	label: string
	icon: string
	path?: string
	activePaths?: string[]
	requiredPermission?: string
	children?: SideBarItem[]
}
