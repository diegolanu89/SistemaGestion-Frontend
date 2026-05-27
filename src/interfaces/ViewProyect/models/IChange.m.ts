// models/IChangeRequest.m.ts

export type ChangeRequestStatus = 'propuesto' | 'aprobado' | 'rechazado' | 'implementado'

/* =========================================================
🔹 DTO
========================================================= */

export interface ChangeRequestDto {
	id: number

	projectId: number

	code: string

	title: string

	description?: string | null

	requestedBy?: string | null

	requestedDate: string

	status: ChangeRequestStatus

	bacHoursIncrement: number

	bacCostIncrement: number

	approvedBy?: string | null

	approvedDate?: string | null

	createdAt?: string | null

	updatedAt?: string | null
}

/* =========================================================
🔹 CREATE DTO
========================================================= */

export interface CreateChangeRequestDto {
	code: string

	title: string

	description?: string | null

	requestedBy?: string | null

	requestedDate: string

	status: ChangeRequestStatus

	bacHoursIncrement?: number | null

	bacCostIncrement?: number | null

	approvedBy?: string | null

	approvedDate?: string | null
}

/* =========================================================
🔹 UPDATE DTO
========================================================= */

export interface UpdateChangeRequestDto {
	title?: string | null

	description?: string | null

	status?: ChangeRequestStatus

	bacHoursIncrement?: number | null

	bacCostIncrement?: number | null

	approvedBy?: string | null

	approvedDate?: string | null
}

/* =========================================================
🔹 INTERFACE
========================================================= */

export interface ChangeRequestInterface {
	getByProject(projectId: number): Promise<ChangeRequestDto[]>

	create(projectId: number, dto: CreateChangeRequestDto): Promise<ChangeRequestDto>

	update(projectId: number, changeId: number, dto: UpdateChangeRequestDto): Promise<ChangeRequestDto>

	patch(changeId: number, dto: UpdateChangeRequestDto): Promise<ChangeRequestDto>

	delete(projectId: number, changeId: number): Promise<void>
}
