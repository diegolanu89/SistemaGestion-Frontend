import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'
import { HttpClient } from '../../base/services/HttpClient.s'

import { VisibleProjectsInterface } from '../models/IvisibleProject.m'

import { UpdateVisibleProjectsDto, UpdateVisibleProjectsResponseDto, VisibleProjectDto } from '../models/VisibleProject.m'

const BASE = import.meta.env.VITE_API_URL

const normalizeError = (error: unknown): Error => (error instanceof Error ? error : new Error(String(error)))

export class VisibleProjectsBDT implements VisibleProjectsInterface {
	async getAll(): Promise<VisibleProjectDto[]> {
		logger.infoTag(LogTag.View, '[VISIBLE_PROJECTS][BDT] getAll')

		try {
			return await HttpClient.request<VisibleProjectDto[]>(`${BASE}/app/my-visible-projects`)
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}

	async update(dto: UpdateVisibleProjectsDto): Promise<UpdateVisibleProjectsResponseDto> {
		logger.infoTag(LogTag.View, '[VISIBLE_PROJECTS][BDT] update', dto)

		try {
			return await HttpClient.request<UpdateVisibleProjectsResponseDto>(`${BASE}/app/my-visible-projects`, {
				method: 'POST',

				body: JSON.stringify(dto),
			})
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}
}
