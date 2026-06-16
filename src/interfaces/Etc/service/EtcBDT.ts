import { HttpClient } from '../../base/services/HttpClient.s'
import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'
import { CreateEtcRecordDto, UpdateEtcRecordDto, CreateSnapshotDto, BulkEtcDto, ValidateEtcCapacityDto } from '../model/Etc.m'
import {
	IEtcApi,
	GetEtcByProjectResponse,
	CreateEtcResponse,
	UpdateEtcResponse,
	DeleteEtcResponse,
	DeleteByProjectResponse,
	ProjectSummaryDto,
	FinalizeBaselineResponse,
	CreateSnapshotResponse,
	BulkEtcResponse,
	ValidateCapacityResponse,
	ExportCapacityDto,
} from '../model/IEtcApi.m'

const BASE = import.meta.env.VITE_API_URL

const normalizeError = (error: unknown): Error => (error instanceof Error ? error : new Error(String(error)))

export class EtcBDT implements IEtcApi {
	// ==========================
	// GET BY PROJECT
	// ==========================

	async getByProject(projectId: number, snapshot?: string): Promise<GetEtcByProjectResponse> {
		logger.infoTag(LogTag.Adapter, `[ETC][BDT] getByProject -> id=${projectId}`)

		try {
			const url = `${BASE}/projects/${projectId}/etc${snapshot ? `?snapshot=${snapshot}` : ''}`

			return await HttpClient.request<GetEtcByProjectResponse>(url)
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}

	// ==========================
	// CREATE
	// ==========================

	async create(projectId: number, dto: CreateEtcRecordDto): Promise<CreateEtcResponse> {
		logger.infoTag(LogTag.Adapter, `[ETC][BDT] create -> projectId=${projectId}`, dto)

		try {
			return await HttpClient.request<CreateEtcResponse>(`${BASE}/projects/${projectId}/etc`, {
				method: 'POST',

				body: JSON.stringify(dto),
			})
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}

	// ==========================
	// UPDATE
	// ==========================

	async update(id: number, dto: UpdateEtcRecordDto): Promise<UpdateEtcResponse> {
		logger.infoTag(LogTag.Adapter, `[ETC][BDT] update -> id=${id}`, dto)

		try {
			return await HttpClient.request<UpdateEtcResponse>(`${BASE}/etc/${id}`, {
				method: 'PUT',

				body: JSON.stringify(dto),
			})
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}

	// ==========================
	// DELETE
	// ==========================

	async delete(id: number): Promise<DeleteEtcResponse> {
		logger.infoTag(LogTag.Adapter, `[ETC][BDT] delete -> id=${id}`)

		try {
			return await HttpClient.request<DeleteEtcResponse>(`${BASE}/etc/${id}`, {
				method: 'DELETE',
			})
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}

	// ==========================
	// DELETE BY PROJECT
	// ==========================

	async deleteByProject(projectId: number): Promise<DeleteByProjectResponse> {
		logger.infoTag(LogTag.Adapter, `[ETC][BDT] deleteByProject -> projectId=${projectId}`)

		try {
			return await HttpClient.request<DeleteByProjectResponse>(`${BASE}/etc/project/${projectId}`, {
				method: 'DELETE',
			})
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}

	// ==========================
	// PROJECTS SUMMARY
	// ==========================

	async getProjectsSummary(): Promise<ProjectSummaryDto[]> {
		logger.infoTag(LogTag.Adapter, '[ETC][BDT] getProjectsSummary')

		try {
			return await HttpClient.request<ProjectSummaryDto[]>(`${BASE}/etc/projects-summary`)
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}

	// ==========================
	// FINALIZE BASELINE
	// ==========================

	async finalizeBaseline(projectId: number): Promise<FinalizeBaselineResponse> {
		logger.infoTag(LogTag.Adapter, `[ETC][BDT] finalizeBaseline -> projectId=${projectId}`)

		try {
			return await HttpClient.request<FinalizeBaselineResponse>(`${BASE}/projects/${projectId}/etc/finalize-baseline`, {
				method: 'POST',
			})
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}

	// ==========================
	// CREATE SNAPSHOT
	// ==========================

	async createSnapshot(projectId: number, dto: CreateSnapshotDto): Promise<CreateSnapshotResponse> {
		logger.infoTag(LogTag.Adapter, `[ETC][BDT] createSnapshot -> projectId=${projectId}`, dto)

		try {
			return await HttpClient.request<CreateSnapshotResponse>(`${BASE}/projects/${projectId}/etc/snapshot`, {
				method: 'POST',

				body: JSON.stringify(dto),
			})
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}

	// ==========================
	// STORE BULK
	// ==========================

	async storeBulk(dto: BulkEtcDto): Promise<BulkEtcResponse> {
		logger.infoTag(LogTag.Adapter, '[ETC][BDT] storeBulk', dto)

		try {
			return await HttpClient.request<BulkEtcResponse>(`${BASE}/etc/bulk`, {
				method: 'POST',

				body: JSON.stringify(dto),
			})
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}

	// ==========================
	// VALIDATE CAPACITY
	// ==========================

	async validateCapacity(dto: ValidateEtcCapacityDto): Promise<ValidateCapacityResponse> {
		logger.infoTag(LogTag.Adapter, '[ETC][BDT] validateCapacity', dto)

		try {
			return await HttpClient.request<ValidateCapacityResponse>(`${BASE}/etc/validate-capacity`, {
				method: 'POST',

				body: JSON.stringify(dto),
			})
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}

	// ==========================
	// EXPORT CAPACITIES
	// ==========================

	async exportCapacities(): Promise<ExportCapacityDto[]> {
		logger.infoTag(LogTag.Adapter, '[ETC][BDT] exportCapacities')

		try {
			return await HttpClient.request<ExportCapacityDto[]>(`${BASE}/etc/export-capacities`)
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}
}
