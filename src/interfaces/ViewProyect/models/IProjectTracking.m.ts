// models/ProjectTrackingInterface.m.ts

/* =========================================================
🔹 UPDATE DTO
========================================================= */

export interface ProjectTrackingUpdateDto {
	id: number

	projectTrackingId: number

	changeEndDate?: string | null

	observations?: string | null

	createdAt?: string | null

	updatedAt?: string | null
}

/* =========================================================
🔹 TRACKING DTO
========================================================= */

export interface ProjectTrackingDto {
	id: number

	projectId: number

	startDate?: string | null

	plannedEndDate?: string | null

	actualEndDate?: string | null

	implementationDate?: string | null

	createdAt?: string | null

	updatedAt?: string | null

	updates: ProjectTrackingUpdateDto[]
}

/* =========================================================
🔹 CREATE / UPDATE DTO
========================================================= */

export interface UpsertProjectTrackingDto {
	startDate: string

	plannedEndDate: string

	actualEndDate?: string | null

	implementationDate?: string | null
}

export interface CreateTrackingUpdateDto {
	changeEndDate: string

	observations: string
}

export interface UpdateTrackingUpdateDto {
	changeEndDate?: string

	observations?: string
}

/* =========================================================
🔹 RESPONSE DTO
========================================================= */

export interface GetProjectTrackingResponseDto {
	success: boolean

	data: ProjectTrackingDto | null
}

/* =========================================================
🔹 INTERFACE
========================================================= */

export interface ProjectTrackingInterface {
	getTracking(projectId: number): Promise<ProjectTrackingDto | null>

	createTracking(projectId: number, dto: UpsertProjectTrackingDto): Promise<ProjectTrackingDto>

	updateTracking(projectId: number, dto: UpsertProjectTrackingDto): Promise<ProjectTrackingDto>

	addUpdate(projectId: number, dto: CreateTrackingUpdateDto): Promise<ProjectTrackingUpdateDto>

	editUpdate(projectId: number, updateId: number, dto: UpdateTrackingUpdateDto): Promise<ProjectTrackingUpdateDto>

	deleteUpdate(projectId: number, updateId: number): Promise<void>
}
