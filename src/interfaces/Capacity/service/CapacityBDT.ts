import logger from '../../base/controllers/Logger.c'

import { LogTag } from '../../base/model/LogTag.m'

import { HttpClient } from '../../base/services/HttpClient.s'

import { ValidateCapacityRequestDto, ValidateCapacityResponseDto, CapacityLimitsRequestDto, CapacityLimitsResponseDto } from '../model/CapacityDto.m'

import { ICapacity } from '../model/ICapacity.m'

const BASE_URL = import.meta.env.VITE_API_URL

const normalizeError = (error: unknown): Error => (error instanceof Error ? error : new Error(String(error)))

export class CapacityBDT implements ICapacity {
	async validateCapacity(req: ValidateCapacityRequestDto): Promise<ValidateCapacityResponseDto> {
		logger.infoTag(LogTag.Adapter, `[CAPACITY][BDT] validateCapacity -> entries=${req.entries.length}`)

		try {
			return await HttpClient.request<ValidateCapacityResponseDto>(`${BASE_URL}/potencial-projects/validate-capacity`, {
				method: 'POST',

				body: JSON.stringify(req),
			})
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}

	async getCapacityLimits(req: CapacityLimitsRequestDto): Promise<CapacityLimitsResponseDto> {
		logger.infoTag(LogTag.Adapter, `[CAPACITY][BDT] getCapacityLimits`)

		try {
			return await HttpClient.request<CapacityLimitsResponseDto>(`${BASE_URL}/potencial-projects/capacity-limits`, {
				method: 'POST',

				body: JSON.stringify(req),
			})
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}
}
