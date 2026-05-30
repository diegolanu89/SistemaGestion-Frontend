// model/ProjectMetricsDTO.m.ts

export interface ProjectMetricDto {
	project_id: number

	project_name: string

	bac: number

	ac: number

	ev: number

	pv: number

	etc: number

	eac: number

	vac: number

	spi: number

	cpi: number
}

export interface BatchMetricsResponseDto {
	metrics: ProjectMetricDto[]
}
