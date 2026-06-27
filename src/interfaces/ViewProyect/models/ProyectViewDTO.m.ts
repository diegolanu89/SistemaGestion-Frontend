// models/Project.m.ts

// models/ProyectViewDTO.m.ts

export interface ProjectTrackingRef {
	id: number
	startDate: string | null
	plannedEndDate: string | null
	actualEndDate: string | null
	implementationDate: string | null
	updatesCount: number
}

export interface ProjectDto {
	id: number
	timesheetProjectId: string
	name: string
	code?: string | null
	clientId?: number | null
	clientName?: string | null
	status: string

	projectTrackingId?: number | null
	tracking?: ProjectTrackingRef | null

	bacBaseHours: number
	bacBaseCost: number
	bacTotalHours: number
	bacTotalCost: number

	hourlyRate: number
	etcCalculationMode: string

	createdAt?: string | null
	updatedAt?: string | null

	filter?: unknown | null

	etcTotalHours: number
}

export interface UpdateBacDto {
	bacBaseHours?: number
	bacBaseCost?: number
	etcCalculationMode?: string
}
