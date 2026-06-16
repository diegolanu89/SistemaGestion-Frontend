import type { Dispatch, SetStateAction } from 'react'

import type { EtcEntryDto } from './Etc.m'
import type { EtcSnapshotDto } from './IEtcApi.m'

import type { UserRefDto } from '../../EstimatedProjects/models/EstimatedProjectDTO.m'

export interface GridValues {
	[userId: number]: Record<string, number>
}

export interface IEtcContext {
	/* =========================================
	🔹 PROJECT
	========================================= */

	projectId: number

	setProjectId: Dispatch<SetStateAction<number>>

	snapshot: EtcSnapshotDto | null

	setSnapshot: Dispatch<SetStateAction<EtcSnapshotDto | null>>

	projectName: string

	setProjectName: Dispatch<SetStateAction<string>>

	bac: number

	setBac: Dispatch<SetStateAction<number>>

	/* =========================================
	🔹 ETC
	========================================= */

	entries: EtcEntryDto[]

	setEntries: Dispatch<SetStateAction<EtcEntryDto[]>>

	updateEntry: (index: number, hours: number) => void

	/* =========================================
	🔹 ERRORS
	========================================= */

	errors: {
		message: string
		userName?: string
		monthKey?: string
	}[]

	setErrors: Dispatch<SetStateAction<IEtcContext['errors']>>


	/* =========================================
	🔹 LOADING
	========================================= */

	loading: boolean

	setLoading: Dispatch<SetStateAction<boolean>>

	/* =========================================
	🔹 SEARCH
	========================================= */

	search: string

	setSearch: Dispatch<SetStateAction<string>>

	/* =========================================
	🔹 MONTHS
	========================================= */

	selectedMonths: string[]

	setSelectedMonths: Dispatch<SetStateAction<string[]>>

	monthToAdd: string

	setMonthToAdd: Dispatch<SetStateAction<string>>

	/* =========================================
	🔹 USERS
	========================================= */

	users: UserRefDto[]

	setUsers: Dispatch<SetStateAction<UserRefDto[]>>

	selectedUserIds: Set<number>

	setSelectedUserIds: Dispatch<SetStateAction<Set<number>>>

	/* =========================================
	🔹 GRID
	========================================= */

	values: GridValues

	setValues: Dispatch<SetStateAction<GridValues>>
}
