import { userAdapter } from '../service/UserRefAdapter'

export const useUserRef = () => {
	return {
		getUsers: userAdapter.getUsers.bind(userAdapter),
	}
}
