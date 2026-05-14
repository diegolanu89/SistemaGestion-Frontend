// models/EstimatedProjectRefs.m.ts

import { ClientRefDto, UserRefDto } from './EstimatedProjectDTO.m'

export interface EstimatedProjectRefs {
	clients: ClientRefDto[]
	users: UserRefDto[]
}

export type EstimatedProjectMonthlyGridValues = Record<number, Record<string, number>>
