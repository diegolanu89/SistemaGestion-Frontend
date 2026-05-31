/**
 * DTO de `GET /api/projects/{id}/metrics` y `GET /api/projects/metrics/batch`.
 *
 * El backend serializa los anonymous objects de `ProjectMetricsService` con
 * los nombres literales en snake_case (no se camelCasea porque ya están
 * en minúscula). Por eso este DTO replica los nombres exactos del JSON.
 */
export interface ProjectMetricsHoursDto {
	bac_base_hours: number
	bac_total_hours: number
	ac_hours_base: number
	ac_hours_cc: number
	ac_hours_total: number
	etc_hours: number
	eac_hours: number
	vac_hours: number
}

export interface ProjectMetricsCostDto {
	hourly_rate: number
	ac_cost: number
	etc_cost: number
	eac_cost: number
	vac_cost: number
}

export interface ProjectMetricsDto {
	project_id: number
	project_name: string
	filters?: { from?: string | null; to?: string | null }
	hours: ProjectMetricsHoursDto
	cost: ProjectMetricsCostDto
	/** Cuando el batch no puede calcular las métricas de un proyecto */
	error?: string
}

export interface ProjectMetricsBatchResponse {
	metrics: ProjectMetricsDto[]
}
