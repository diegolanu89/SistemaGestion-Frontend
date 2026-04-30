// models/EstimatedProjectDTO.m.ts

// ==========================
// 🔹 REF DTOs
// ==========================

export interface ClientRefDto {
	Id: number
	Name: string
	IsActive: boolean
}

export interface UserRefDto {
	Id: number
	Username: string
	FullName: string
	IsActive: boolean
}

// ==========================
// 🔹 CAPACITY (RF-09)
// ==========================

/** R = Proyecto real (operativo) | E = Proyecto estimado (potencial) */
export type AssignmentKind = 'R' | 'E'

export interface UserAssignmentDto {
	Kind: AssignmentKind
	ProjectCode: string | null
	ProjectLabel: string
	Hours: number
}

export interface UserMonthWorkloadDto {
	UserId: number
	MonthKey: string
	Assignments: UserAssignmentDto[]
}

export interface MonthlyCapacityDto {
	MonthKey: string
	AvailableHours: number
}

// ==========================
// 🔹 RESOURCE ASSIGNMENT
// ==========================

/**
 * Cada recurso asignado a un proyecto estimado tiene horas por mes.
 * MonthlyHours es un mapa "YYYY-MM" -> horas estimadas.
 */
export interface EstimatedResourceDto {
	UserId: number
	UserName: string
	MonthlyHours: Record<string, number>
}

// ==========================
// 🔹 MAIN DTO
// ==========================

export interface EstimatedProjectRecordDto {
	Id: number

	ClientId: number | null
	ClientName: string | null

	ProjectName: string
	Code: string | null

	Resources: EstimatedResourceDto[]

	IsActive: boolean

	CreatedAt?: string | null
	UpdatedAt?: string | null
	CreatedBy?: number | null
	UpdatedBy?: number | null
}

// ==========================
// 🔹 REQUEST DTOs
// ==========================

export interface CreateEstimatedProjectDto {
	ClientId?: number | null
	NewClientName?: string | null

	ProjectName: string
	Code?: string | null

	Resources: EstimatedResourceDto[]
}

export interface UpdateEstimatedProjectDto {
	ClientId?: number | null
	NewClientName?: string | null

	ProjectName?: string
	Code?: string | null

	Resources?: EstimatedResourceDto[]
}
