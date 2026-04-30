// models/EtcDtos.m.ts

export interface EtcEntryDto {
	userName: string
	monthKey: string
	monthLabel: string
	hours: number
}

export interface EtcRecordDto {
	id: number
	projectId: number
	snapshotId?: number | null
	userId?: number | null
	userName?: string | null
	monthKey: string
	monthLabel: string
	hours: number
	createdAt?: string | null
	updatedAt?: string | null
}

export interface CreateEtcRecordDto {
	users: string[]
	monthKey: string
	monthLabel: string
	hours: number
}

export interface UpdateEtcRecordDto {
	userName: string
	monthKey: string
	monthLabel: string
	hours: number
}

export interface BulkEtcDto {
	projectId: number
	entries: EtcEntryDto[]
}

export interface CreateSnapshotDto {
	entries: EtcEntryDto[]
}

export interface ValidateEtcCapacityDto {
	projectId: number
	entries: EtcEntryDto[]
}
