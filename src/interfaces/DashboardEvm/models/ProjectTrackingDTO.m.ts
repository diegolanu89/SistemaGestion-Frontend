/**
 * DTO del modal "Seguimiento de Proyectos: Planificación, Desvíos y Fechas Reales"
 * que el Dashboard EVM abre al hacer click en la columna Control de cambios.
 *
 * TODO RF-10: coordinar con backend para que exponga GET /projects/:id/tracking
 * con esta forma. Mientras tanto, el mock lo provee.
 */
export interface TrackingHistoryEntry {
	id: number
	endDate: string | null
	observations: string
	registeredAt: string
}

export interface ProjectTrackingDto {
	projectId: number
	projectName: string
	projectCode?: string | null

	startDate: string | null
	endDatePlanned: string | null
	endDateActual: string | null
	implementationDate: string | null

	history: TrackingHistoryEntry[]
}
