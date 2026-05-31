/**
 * DTO de `GET /api/projects/{projectId}/change-requests`.
 *
 * El backend serializa con camelCase (default ASP.NET Core). El endpoint
 * devuelve un array plano de change requests (no envuelto en {success, data}).
 *
 * El Dashboard EVM lo consume para:
 *  - poblar la columna "Control de cambios" (cantidad de change requests del proyecto)
 *  - abrir el modal con la tabla: Código / Título / Estado / Fecha solicitud / Δ hs BAC
 */
export type ChangeRequestStatus = 'propuesto' | 'aprobado' | 'rechazado' | 'implementado'

export interface ChangeRequestDto {
	id: number
	projectId: number
	code: string
	title: string
	description: string | null
	requestedBy: string | null
	requestedDate: string
	status: ChangeRequestStatus
	bacHoursIncrement: number
	bacCostIncrement: number
	approvedBy: string | null
	approvedDate: string | null
	createdAt: string
	updatedAt: string
}
