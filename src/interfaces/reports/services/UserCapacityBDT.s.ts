import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'
import { HttpClient } from '../../base/services/HttpClient.s'
import { IUserMonthlyCapacity } from '../models/IUserCapacity.m'
import { UserMonthlyCapacityDto, CreateUserMonthlyCapacityDto } from '../models/UserCapacityDTO.m'

const BASE_URL = import.meta.env.VITE_API_URL

const normalizeError = (error: unknown): Error => (error instanceof Error ? error : new Error(String(error)))

export class UserMonthlyCapacityBDT implements IUserMonthlyCapacity {
	async getUserCapacities(userId: number): Promise<UserMonthlyCapacityDto[]> {
		logger.infoTag(LogTag.Adapter, `[USER_CAPACITY][BDT] getUserCapacities -> ${userId}`)

		try {
			const response = await HttpClient.request<{
				success: boolean

				data: UserMonthlyCapacityDto[]
			}>(`${BASE_URL}/timesheet-users/${userId}/capacities`)

			return response.data
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}

	async saveUserCapacities(userId: number, data: CreateUserMonthlyCapacityDto): Promise<UserMonthlyCapacityDto[]> {
		logger.infoTag(LogTag.Adapter, `[USER_CAPACITY][BDT] saveUserCapacities -> ${userId}`)

		try {
			const response = await HttpClient.request<{
				success: boolean

				data: UserMonthlyCapacityDto[]
			}>(`${BASE_URL}/timesheet-users/${userId}/capacities`, {
				method: 'POST',

				body: JSON.stringify(data),
			})

			return response.data
		} catch (error: unknown) {
			const err = normalizeError(error)

			logger.errorTag(LogTag.Adapter, err)

			throw err
		}
	}
}
