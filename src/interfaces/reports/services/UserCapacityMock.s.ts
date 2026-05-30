import { IUserMonthlyCapacity } from '../models/IUserCapacity.m'
import { UserMonthlyCapacityDto, CreateUserMonthlyCapacityDto } from '../models/UserCapacityDTO.m'

export class UserMonthlyCapacityMock implements IUserMonthlyCapacity {
	async getUserCapacities(): Promise<UserMonthlyCapacityDto[]> {
		return []
	}

	async saveUserCapacities(_userId: number, data: CreateUserMonthlyCapacityDto): Promise<UserMonthlyCapacityDto[]> {
		return data.entries.map((entry, index) => ({
			id: index + 1,

			userId: 1,

			monthKey: entry.monthKey,

			monthLabel: entry.monthLabel,

			hours: entry.hours,
		}))
	}
}
