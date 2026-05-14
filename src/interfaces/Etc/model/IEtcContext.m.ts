import type { Dispatch, SetStateAction } from 'react'

import type { EtcEntryDto } from './Etc.m'

import type { UserRefDto } from '../../EstimatedProjects/models/EstimatedProjectDTO.m'

export interface GridValues {
	[userId: number]: Record<string, number>
}

export interface IEtcContext {
	projectId: number

	entries: EtcEntryDto[]
	setEntries: Dispatch<SetStateAction<EtcEntryDto[]>>

	updateEntry: (index: number, hours: number) => void

	errors: {
		message: string
		userName?: string
		monthKey?: string
	}[]
	setErrors: Dispatch<SetStateAction<IEtcContext['errors']>>

	loading: boolean
	setLoading: Dispatch<SetStateAction<boolean>>

	projectName: string
	setProjectName: Dispatch<SetStateAction<string>>

	bac: number
	setBac: Dispatch<SetStateAction<number>>

	search: string
	setSearch: Dispatch<SetStateAction<string>>

	selectedMonths: string[]
	setSelectedMonths: Dispatch<SetStateAction<string[]>>

	monthToAdd: string
	setMonthToAdd: Dispatch<SetStateAction<string>>

	users: UserRefDto[]
	setUsers: Dispatch<SetStateAction<UserRefDto[]>>

	selectedUserIds: Set<number>
	setSelectedUserIds: Dispatch<SetStateAction<Set<number>>>

	values: GridValues
	setValues: Dispatch<SetStateAction<GridValues>>
}
