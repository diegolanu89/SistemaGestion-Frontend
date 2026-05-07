import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'
import { ValidateCapacityRequestDto, ValidateCapacityResponseDto, CapacityLimitsRequestDto, CapacityLimitsResponseDto } from '../model/CapacityDto.m'
import { ICapacity } from '../model/ICapacity.m'

const BASE_URL = import.meta.env.VITE_API_URL
const TOKEN_STORAGE_KEY = 'authUser'

const authFetch = async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
	const token = localStorage.getItem(TOKEN_STORAGE_KEY)

	const headers = new Headers(init?.headers)

	if (!headers.has('Content-Type') && init?.body) {
		headers.set('Content-Type', 'application/json')
	}

	if (token) {
		headers.set('Authorization', `Bearer ${token}`)
	}

	return fetch(input, {
		...init,
		headers,
	})
}

const normalizeError = (error: unknown): Error => (error instanceof Error ? error : new Error(String(error)))

export class CapacityBDT implements ICapacity {
	async validateCapacity(req: ValidateCapacityRequestDto): Promise<ValidateCapacityResponseDto> {
		logger.infoTag(LogTag.Adapter, `[CAPACITY][BDT] validateCapacity -> entries=${req.entries.length}`)

		try {
			const res = await authFetch(`${BASE_URL}/potencial-projects/validate-capacity`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(req),
			})

			if (!res.ok) {
				throw new Error(`Error validating capacity (status=${res.status})`)
			}

			return (await res.json()) as ValidateCapacityResponseDto
		} catch (error: unknown) {
			const err = normalizeError(error)
			logger.errorTag(LogTag.Adapter, err)
			throw err
		}
	}

	async getCapacityLimits(req: CapacityLimitsRequestDto): Promise<CapacityLimitsResponseDto> {
		logger.infoTag(LogTag.Adapter, `[CAPACITY][BDT] getCapacityLimits`)

		try {
			const res = await authFetch(`${BASE_URL}/potencial-projects/capacity-limits`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(req),
			})

			if (!res.ok) {
				throw new Error(`Error fetching capacity limits (status=${res.status})`)
			}

			return (await res.json()) as CapacityLimitsResponseDto
		} catch (error: unknown) {
			const err = normalizeError(error)
			logger.errorTag(LogTag.Adapter, err)
			throw err
		}
	}
}
