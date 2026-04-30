// models/IEstimatedProject.m.ts

import {
	EstimatedProjectRecordDto,
	CreateEstimatedProjectDto,
	UpdateEstimatedProjectDto,
	ClientRefDto,
	UserRefDto,
	MonthlyCapacityDto,
	UserMonthWorkloadDto,
} from './EstimatedProjectDTO.m'

export interface EstimatedProjectInterface {
	// ==========================
	// CRUD
	// ==========================
	list(): Promise<EstimatedProjectRecordDto[]>

	getById(id: number): Promise<EstimatedProjectRecordDto | null>

	create(data: CreateEstimatedProjectDto): Promise<EstimatedProjectRecordDto>

	update(id: number, data: UpdateEstimatedProjectDto): Promise<EstimatedProjectRecordDto>

	delete(id: number): Promise<void>

	// ==========================
	// REFS
	// ==========================
	getClients(): Promise<ClientRefDto[]>

	getUsers(): Promise<UserRefDto[]>

	// ==========================
	// CAPACITY (RF-09)
	// ==========================
	getMonthlyCapacities(monthKeys: string[]): Promise<MonthlyCapacityDto[]>

	getUserWorkload(userIds: number[], monthKeys: string[]): Promise<UserMonthWorkloadDto[]>
}
