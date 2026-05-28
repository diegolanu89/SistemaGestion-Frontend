import { IUserRef } from '../model/IUserRef.m'
import { UserRefDto } from '../model/UserRefDTO.m'

export class UserRefMock implements IUserRef {
	async getUsers(): Promise<UserRefDto[]> {
		return [
			{
				Id: 1,
				Username: 'mock.user',
				FullName: 'Mock User',
				IsActive: true,
			},
		]
	}
}
