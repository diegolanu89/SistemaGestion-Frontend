// models/EstimatedProjectRefs.m.ts

import { ClientRefDto, UserRefDto } from './EstimatedProjectDTO.m'

export interface EstimatedProjectRefs {
	clients: ClientRefDto[]
	users: UserRefDto[]
}
