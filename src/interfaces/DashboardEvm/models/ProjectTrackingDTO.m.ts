/**
 * DTO del módulo "Seguimiento de Proyectos: Planificación, Desvíos y Fechas Reales".
 *
 * Shape real del backend `GET /api/project-trackings/{projectId}` envuelto en
 * `{ success, data }`. La respuesta puede ser `data: null` si el proyecto no
 * tiene tracking registrado.
 *
 * El Dashboard EVM lo consume para:
 *  - colorear el chip "S" en la columna Proyecto (azul si tiene tracking, gris si no)
 *  - poblar el modal de seguimiento al hacer click en ese chip
 */
export interface ProjectTrackingUpdateDto {
	id: number
	projectTrackingId: number
	changeEndDate: string | null
	observations: string | null
	createdAt: string
	updatedAt: string
}

export interface ProjectTrackingDto {
	id: number
	projectId: number
	startDate: string | null
	plannedEndDate: string | null
	actualEndDate: string | null
	implementationDate: string | null
	createdAt: string
	updatedAt: string
	updates: ProjectTrackingUpdateDto[]
}

export interface ProjectTrackingResponse {
	success: boolean
	data: ProjectTrackingDto | null
	message?: string
}
