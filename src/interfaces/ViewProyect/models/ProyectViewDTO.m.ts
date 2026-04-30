// models/Project.m.ts

// models/ProyectViewDTO.m.ts

export interface ProjectDto {
	id: number
	clockifyProjectId: string
	name: string
	code?: string | null
	clientId?: number | null
	clientName?: string | null
	status: string

	startDate?: string | null
	endDatePlanned?: string | null
	endDateActual?: string | null

	bacBaseHours: number
	bacBaseCost: number
	bacTotalHours: number
	bacTotalCost: number

	hourlyRate: number
	etcCalculationMode: string

	createdAt?: string | null
	updatedAt?: string | null

	filter?: unknown | null

	etcHours?: number
}

export interface UpdateBacDto {
	bacBaseHours?: number
	bacBaseCost?: number
	etcCalculationMode?: string
}
