// models/ProjectTrackingInterface.m.ts

/* =========================================================
🔹 UPDATE DTO
========================================================= */

export interface ProjectTrackingUpdateDto {
	id: number

	projectTrackingId: number

	milestoneDate?: string | null

	observations?: string | null

	createdAt?: string | null

	updatedAt?: string | null
}

/* =========================================================
🔹 TRACKING DTO
========================================================= */

export interface ProjectTrackingDto {
	id: number

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
	startDate?: string | null

	plannedEndDate?: string | null

	actualEndDate?: string | null

	implementationDate?: string | null
}

export interface CreateTrackingUpdateDto {
	milestoneDate: string

	observations: string
}

export interface UpdateTrackingUpdateDto {
	milestoneDate?: string

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
	getTracking(trackingId: number): Promise<ProjectTrackingDto | null>

	updateTracking(trackingId: number, dto: UpsertProjectTrackingDto): Promise<ProjectTrackingDto>

	addUpdate(trackingId: number, dto: CreateTrackingUpdateDto): Promise<ProjectTrackingUpdateDto>

	editUpdate(trackingId: number, updateId: number, dto: UpdateTrackingUpdateDto): Promise<ProjectTrackingUpdateDto>

	deleteUpdate(trackingId: number, updateId: number): Promise<void>
}
