// models/IEstimatedProject.m.ts

import {
	EstimatedProjectRecordDto,
	CreateEstimatedProjectDto,
	UpdateEstimatedProjectDto,
	ClientRefDto,
	UserRefDto,
	CapacityLimitsRequestDto,
	CapacityLimitsResponseDto,
	ValidateCapacityRequestDto,
	ValidateCapacityResponseDto,
	AllocationEntryDto,
	AllocationWireDto,
} from './EstimatedProjectDTO.m'

export interface EstimatedProjectInterface {
	// ==========================
	// CRUD principal — POTENCIAL PROJECTS
	// /api/potencial-projects
	// ==========================
	list(): Promise<EstimatedProjectRecordDto[]>

	getById(id: number): Promise<EstimatedProjectRecordDto | null>

	/** Cadena: opcional crear cliente → crear proyecto → guardar allocations. */
	create(data: CreateEstimatedProjectDto): Promise<EstimatedProjectRecordDto>

	update(id: number, data: UpdateEstimatedProjectDto): Promise<EstimatedProjectRecordDto>

	/** Borrado FÍSICO — el back hace DELETE definitivo. */
	delete(id: number): Promise<void>

	// ==========================
	// ALLOCATIONS (filas user × mes)
	// /api/potencial-projects/{id}/allocations
	// ==========================
	getAllocations(projectId: number): Promise<AllocationWireDto[]>

	/** Replace-all: el back borra todas las allocations existentes y reescribe. */
	saveAllocations(projectId: number, entries: AllocationEntryDto[]): Promise<AllocationWireDto[]>

	// ==========================
	// VALIDATE CAPACITY
	// POST /api/potencial-projects/validate-capacity
	// ==========================
	validateCapacity(req: ValidateCapacityRequestDto): Promise<ValidateCapacityResponseDto>

	// ==========================
	// CAPACITY LIMITS
	// POST /api/potencial-projects/capacity-limits
	// ==========================
	getCapacityLimits(req: CapacityLimitsRequestDto): Promise<CapacityLimitsResponseDto>

	// ==========================
	// REFS
	// ==========================
	/** GET /api/potencial-clients */
	getClients(): Promise<ClientRefDto[]>

	/** POST /api/potencial-clients — devuelve el cliente recién creado. */
	createClient(name: string): Promise<ClientRefDto>

	/** Listado de usuarios de Clockify (asumimos endpoint en /api/clockify-users). */
	getUsers(): Promise<UserRefDto[]>
}
