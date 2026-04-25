import { NavigateFunction } from 'react-router-dom'
import { IUser } from './IUser.m'

export interface LoginControllerDeps {
	setUser: (u: IUser) => void
	navigate: NavigateFunction
}
