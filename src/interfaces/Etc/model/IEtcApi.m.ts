// services/IEtcApi.s.ts

import { BulkEtcDto, CreateEtcRecordDto, CreateSnapshotDto, EtcRecordDto, UpdateEtcRecordDto, ValidateEtcCapacityDto } from './Etc.m'

export interface EtcSnapshotDto {
	id: number
	version: number
	label: string
	created_at?: string | null
}

export interface GetEtcByProjectResponse {
	snapshot: EtcSnapshotDto | null
	records: EtcRecordDto[]
}

export interface CreateEtcResponse {
	message: string
	records: EtcRecordDto[]
}

export interface UpdateEtcResponse {
	message: string
	record: EtcRecordDto
}

export interface DeleteEtcResponse {
	message: string
}

export interface DeleteByProjectResponse {
	message: string
	deleted: number
}

export interface ProjectSummaryDto {
	id: number
	name: string
	code: string
	client_id?: number
	client_name?: string
}

export interface FinalizeBaselineResponse {
	message: string
	snapshot: EtcSnapshotDto
}

export interface CreateSnapshotResponse {
	message: string
	snapshot: EtcSnapshotDto
	records: EtcRecordDto[]
}

export interface BulkEtcResponse {
	message: string
	records: EtcRecordDto[]
}

export interface ValidateCapacityResponse {
	valid: boolean
	errors: {
		message: string
		userName?: string
		monthKey?: string
	}[]
	message?: string
}

export interface ExportCapacityDto {
	project_id: number
	project_name: string
	user_name: string
	hours: number
	month_key: string
	month_label: string
}

export interface IEtcApi {
	getByProject(projectId: number, snapshot?: 'baseline'): Promise<GetEtcByProjectResponse>

	create(projectId: number, dto: CreateEtcRecordDto): Promise<CreateEtcResponse>

	update(id: number, dto: UpdateEtcRecordDto): Promise<UpdateEtcResponse>

	delete(id: number): Promise<DeleteEtcResponse>

	deleteByProject(projectId: number): Promise<DeleteByProjectResponse>

	getProjectsSummary(): Promise<ProjectSummaryDto[]>

	finalizeBaseline(projectId: number): Promise<FinalizeBaselineResponse>

	createSnapshot(projectId: number, dto: CreateSnapshotDto): Promise<CreateSnapshotResponse>

	storeBulk(dto: BulkEtcDto): Promise<BulkEtcResponse>

	validateCapacity(dto: ValidateEtcCapacityDto): Promise<ValidateCapacityResponse>

	exportCapacities(): Promise<ExportCapacityDto[]>
}
