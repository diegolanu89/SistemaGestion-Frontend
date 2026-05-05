import { CreateEtcRecordDto, UpdateEtcRecordDto, CreateSnapshotDto, BulkEtcDto, ValidateEtcCapacityDto, EtcRecordDto, EtcEntryDto } from '../model/Etc.m'

import {
	BulkEtcResponse,
	CreateEtcResponse,
	CreateSnapshotResponse,
	DeleteByProjectResponse,
	DeleteEtcResponse,
	ExportCapacityDto,
	FinalizeBaselineResponse,
	GetEtcByProjectResponse,
	IEtcApi,
	ProjectSummaryDto,
	UpdateEtcResponse,
	ValidateCapacityResponse,
	EtcSnapshotDto,
} from '../model/IEtcApi.m'

import recordsMock from './mocks/etcRecords.mock.json'
import snapshotMock from './mocks/etcSnapshot.mock.json'
import projectsSummaryMock from './mocks/etcProyectsSummary.mock.json'

let records: EtcRecordDto[] = [...(recordsMock as EtcRecordDto[])]
let snapshot: EtcSnapshotDto | null = snapshotMock as EtcSnapshotDto | null
let ID = 1000

export class EtcMock implements IEtcApi {
	// =========================
	// GET
	// =========================
	async getByProject(): Promise<GetEtcByProjectResponse> {
		return {
			snapshot,
			records,
		}
	}

	// =========================
	// CREATE
	// =========================
	async create(projectId: number, dto: CreateEtcRecordDto): Promise<CreateEtcResponse> {
		const newRecords: EtcRecordDto[] = dto.users.map((user) => ({
			id: ID++,
			projectId,
			snapshotId: snapshot?.id ?? null,
			userId: ID,
			userName: user,
			monthKey: dto.monthKey,
			monthLabel: dto.monthLabel,
			hours: dto.hours,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		}))

		records = [...records, ...newRecords]

		return {
			message: 'Mock create OK',
			records: newRecords,
		}
	}

	// =========================
	// UPDATE
	// =========================
	async update(id: number, dto: UpdateEtcRecordDto): Promise<UpdateEtcResponse> {
		const index = records.findIndex((r) => r.id === id)

		if (index === -1) {
			throw new Error('Registro no encontrado')
		}

		const updated: EtcRecordDto = {
			...records[index],
			userName: dto.userName,
			monthKey: dto.monthKey,
			monthLabel: dto.monthLabel,
			hours: dto.hours,
			updatedAt: new Date().toISOString(),
		}

		records[index] = updated

		return {
			message: 'Mock update OK',
			record: updated,
		}
	}

	// =========================
	// DELETE
	// =========================
	async delete(id: number): Promise<DeleteEtcResponse> {
		records = records.filter((r) => r.id !== id)

		return { message: 'Mock delete OK' }
	}

	async deleteByProject(projectId: number): Promise<DeleteByProjectResponse> {
		const before = records.length
		records = records.filter((r) => r.projectId !== projectId)

		return {
			message: 'Mock delete project OK',
			deleted: before - records.length,
		}
	}

	// =========================
	// SUMMARY
	// =========================
	async getProjectsSummary(): Promise<ProjectSummaryDto[]> {
		return projectsSummaryMock as ProjectSummaryDto[]
	}

	// =========================
	// BASELINE
	// =========================
	async finalizeBaseline(): Promise<FinalizeBaselineResponse> {
		if (snapshot) {
			return {
				message: 'Ya existe baseline',
				snapshot,
			}
		}

		snapshot = {
			id: 1,
			version: 1,
			label: 'Línea base',
			created_at: new Date().toISOString(),
		}

		return {
			message: 'Baseline creada',
			snapshot,
		}
	}

	// =========================
	// SNAPSHOT
	// =========================
	async createSnapshot(projectId: number, dto: CreateSnapshotDto): Promise<CreateSnapshotResponse> {
		const version = (snapshot?.version ?? 0) + 1

		snapshot = {
			id: version,
			version,
			label: `Semana ${version}`,
			created_at: new Date().toISOString(),
		}

		const newRecords: EtcRecordDto[] = dto.entries.map((entry: EtcEntryDto) => ({
			id: ID++,
			projectId,
			snapshotId: snapshot!.id,
			userId: ID,
			userName: entry.userName,
			monthKey: entry.monthKey,
			monthLabel: entry.monthLabel,
			hours: entry.hours,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		}))

		records = [...records, ...newRecords]

		return {
			message: 'Snapshot creado',
			snapshot,
			records: newRecords,
		}
	}

	// =========================
	// BULK
	// =========================
	async storeBulk(dto: BulkEtcDto): Promise<BulkEtcResponse> {
		const newRecords: EtcRecordDto[] = dto.entries.map((entry) => ({
			id: ID++,
			projectId: dto.projectId,
			snapshotId: snapshot?.id ?? null,
			userId: ID,
			userName: entry.userName,
			monthKey: entry.monthKey,
			monthLabel: entry.monthLabel,
			hours: entry.hours,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		}))

		records = [...records, ...newRecords]

		return {
			message: 'Mock bulk OK',
			records: newRecords,
		}
	}

	// =========================
	// VALIDATION (USA MOCK REAL)
	// =========================
	async validateCapacity(dto: ValidateEtcCapacityDto): Promise<ValidateCapacityResponse> {
		const errors: ValidateCapacityResponse['errors'] = []

		const DEFAULT_CAPACITY = 160

		for (const entry of dto.entries) {
			// 🔥 simulamos horas ya tomadas (como hace backend)
			const hoursTaken = records
				.filter((r) => r.userName === entry.userName && r.monthKey === entry.monthKey && r.projectId !== dto.projectId)
				.reduce((acc, r) => acc + Number(r.hours), 0)

			const hoursFree = Math.max(0, DEFAULT_CAPACITY - hoursTaken)

			if (entry.hours > hoursFree) {
				errors.push({
					message: `${entry.userName} (${entry.monthLabel}): tiene ${hoursTaken}h tomadas y ${hoursFree}h libres.`,
					userName: entry.userName,
					monthKey: entry.monthKey,
				})
			}
		}

		return {
			valid: errors.length === 0,
			errors,
		}
	}

	// =========================
	// EXPORT
	// =========================
	async exportCapacities(): Promise<ExportCapacityDto[]> {
		return records.map((r) => ({
			project_id: r.projectId,
			project_name: 'Mock Project',
			user_name: r.userName ?? 'N/A',
			hours: r.hours,
			month_key: r.monthKey,
			month_label: r.monthLabel,
		}))
	}
}
