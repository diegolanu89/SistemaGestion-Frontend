export const enum ESTIMATED_PROJECT_PATHS {
	LIST = '/projects/alta-estimados',
	CREATE = '/projects/alta-estimados/nuevo',
	EDIT = '/projects/alta-estimados/:id/editar',
}

export const buildEditPath = (id: number | string): string => `/projects/alta-estimados/${id}/editar`
