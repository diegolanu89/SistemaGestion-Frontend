import { UserRefDto } from './UserRefDTO.m'

export interface IUserRef {
	getUsers(): Promise<UserRefDto[]>
}
