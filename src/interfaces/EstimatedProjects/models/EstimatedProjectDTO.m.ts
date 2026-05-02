// models/EstimatedProjectDTO.m.ts
//
// Alineación contra el back: SistemaGestion-Backend/Controllers/PotencialProjectsController.cs
//   + PotencialClientsController.cs
//
// Convención de casing en este archivo:
// - Tipos que el front consume internamente (record, resources, refs): PascalCase.
//   El BDT se encarga de mapear el wire al shape PascalCase si es necesario.
// - Cuerpos de request/respuesta que tocan la red: dejamos el casing del wire (mezcla
//   de camelCase y snake_case según el back). Los marcamos con sufijo "Wire" cuando
//   conviven con un equivalente PascalCase.

// ==========================
// 🔹 REF DTOs
// ==========================

/** Cliente potencial — alineado a PotencialClientDto del back. */
export interface ClientRefDto {
	Id: number
	Name: string
	CreatedAt?: string | null
	UpdatedAt?: string | null
}

export interface UserRefDto {
	Id: number
	Username: string
	FullName: string
	IsActive: boolean
}

// ==========================
// 🔹 CAPACITY (RF-09)
// POST /api/potencial-projects/capacity-limits
// ==========================

export interface CapacityLimitDto {
	capacity: number
	etc_hours: number
	other_potencial_hours: number
	available: number
}

export type CapacityLimitsMap = Record<string, Record<string, CapacityLimitDto>>

export interface CapacityLimitsRequestDto {
	userNames: string[]
	monthKeys: string[]
	potencialProjectId?: number | null
}

export interface CapacityLimitsResponseDto {
	limits: CapacityLimitsMap
}

// ==========================
// 🔹 VALIDATE CAPACITY
// POST /api/potencial-projects/validate-capacity
// ==========================

export interface ValidateCapacityEntryDto {
	userName: string
	monthKey: string
	monthLabel: string
	hours: number
}

export interface ValidateCapacityRequestDto {
	entries: ValidateCapacityEntryDto[]
	potencialProjectId?: number | null
}

/** Errores tal cual los emite el back (anonymous object → snake_case). */
export interface ValidateCapacityErrorDto {
	user_name: string
	month_key: string
	month_label: string
	hours_entered: number
	capacity?: number | null
	etc_hours?: number | null
	other_potencial_hours?: number | null
	available?: number | null
	message: string
}

export interface ValidateCapacityResponseDto {
	valid: boolean
	errors: ValidateCapacityErrorDto[]
}

// ==========================
// 🔹 ALLOCATIONS
// GET/POST /api/potencial-projects/{id}/allocations
// ==========================

/** Allocation tal cual viene del back (MapAllocationToDto → snake_case). */
export interface AllocationWireDto {
	id: number
	potencial_project_id: number
	month_key: string
	month_label: string | null
	user_id: number | null
	user_name: string
	hours: number
	role: string | null
	role_short: string | null
	created_at: string
	updated_at: string
}

/** Item de body para POST /allocations (back usa case-insensitive deserialization). */
export interface AllocationEntryDto {
	monthKey: string
	monthLabel: string
	userId?: number | null
	userName: string
	hours: number
}

export interface SaveAllocationsRequestDto {
	entries: AllocationEntryDto[]
}

// ==========================
// 🔹 RESOURCE (vista interna)
// ==========================
//
// Las allocations vienen como filas (user, mes, horas). En el front trabajamos con un
// agrupamiento por recurso para mantener la UX de la grilla y la tabla.

export interface EstimatedResourceDto {
	UserId: number | null
	UserName: string
	MonthlyHours: Record<string, number>
}

// ==========================
// 🔹 MAIN DTO
// alineado a PotencialProjectDto del back
// ==========================

export interface EstimatedProjectRecordDto {
	Id: number
	Name: string
	Code: string | null
	ClientId: number | null
	ClientName: string | null

	/** Llenado por el adapter combinando GET /potencial-projects + GET /{id}/allocations. */
	Resources: EstimatedResourceDto[]
}

// ==========================
// 🔹 REQUEST DTOs (CRUD principal)
// ==========================

/**
 * Lo que el form arma en submit. El adapter se encarga de:
 *  1. crear cliente si NewClientName está seteado (POST /potencial-clients)
 *  2. POST /potencial-projects con el id resuelto
 *  3. POST /{id}/allocations con las entries
 */
export interface CreateEstimatedProjectDto {
	ClientId?: number | null
	NewClientName?: string | null
	Name: string
	Code?: string | null
	Resources: EstimatedResourceDto[]
}

export interface UpdateEstimatedProjectDto {
	ClientId?: number | null
	NewClientName?: string | null
	Name?: string
	Code?: string | null
	Resources?: EstimatedResourceDto[]
}
