import { UserMonthlyCapacityDto, CreateUserMonthlyCapacityDto } from './UserCapacityDTO.m'

export interface IUserMonthlyCapacity {
	getUserCapacities(userId: number): Promise<UserMonthlyCapacityDto[]>

	saveUserCapacities(userId: number, data: CreateUserMonthlyCapacityDto): Promise<UserMonthlyCapacityDto[]>
}
