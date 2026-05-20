// services/ProjectFilterBDT.s.ts

import logger from '../../base/controllers/Logger.c'

import { LogTag } from '../../base/model/LogTag.m'

import { HttpClient } from '../../base/services/HttpClient.s'
import { IProjectFilters } from '../model/IprojectFilterAdapter.m'
import { ProjectFilterDto, CreateProjectFilterDto } from '../model/ProjectFilterDto.m'

const BASE_URL = import.meta.env.VITE_API_URL

const normalizeError = (error: unknown): Error => (error instanceof Error ? error : new Error(String(error)))

export class ProjectFilterBDT implements IProjectFilters {
	// ==========================
	// 🔹 GET ALL
	// ==========================

	async getAll(): Promise<ProjectFilterDto[]> {
		logger.infoTag(LogTag.Adapter, '[PROJECT-FILTER][BDT] getAll()')

		try {
			return await HttpClient.request<ProjectFilterDto[]>(`${BASE_URL}/project-filters`)
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}

	// ==========================
	// 🔹 CREATE
	// ==========================

	async create(data: CreateProjectFilterDto): Promise<void> {
		logger.infoTag(LogTag.Adapter, `[PROJECT-FILTER][BDT] create -> total=${data.ProjectIds.length}`)

		try {
			await HttpClient.request(`${BASE_URL}/project-filters`, {
				method: 'POST',

				body: JSON.stringify({
					projectIds: data.ProjectIds,
				}),
			})
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}

	// ==========================
	// 🔹 DELETE
	// ==========================

	async delete(id: number): Promise<void> {
		logger.infoTag(LogTag.Adapter, `[PROJECT-FILTER][BDT] delete -> id=${id}`)

		try {
			await HttpClient.request(`${BASE_URL}/project-filters/${id}`, {
				method: 'DELETE',
			})
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}
}
