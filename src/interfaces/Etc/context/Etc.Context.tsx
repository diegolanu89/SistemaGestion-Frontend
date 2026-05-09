// context/EtcContext.tsx

import { useMemo, useState, ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

import type { EtcEntryDto } from '../model/Etc.m'
import type { IEtcContext, GridValues } from '../model/IEtcContext.m'

import { etcContext } from '../hooks/useEtcContext.h'

import type { UserRefDto } from '../../EstimatedProjects/models/EstimatedProjectDTO.m'

import { monthKeyOf } from '../../EstimatedProjects/utils/months'

interface Props {
	children: ReactNode
}

export const EtcProvider = ({ children }: Props) => {
	const location = useLocation()

	const projectId = Number(location.state?.projectId)

	if (!projectId) {
		throw new Error('EtcProvider: projectId no recibido por navigation state')
	}

	// =========================
	// BASE ETC
	// =========================

	const [entries, setEntries] = useState<EtcEntryDto[]>([])

	const [errors, setErrors] = useState<IEtcContext['errors']>([])

	const [loading, setLoading] = useState(false)

	// =========================
	// WEEKLY VERSION
	// =========================

	const [projectName, setProjectName] = useState('')

	const [bac, setBac] = useState(0)

	const [search, setSearch] = useState('')

	const [selectedMonths, setSelectedMonths] = useState<string[]>([monthKeyOf(new Date())])

	const [monthToAdd, setMonthToAdd] = useState(monthKeyOf(new Date()))

	const [users, setUsers] = useState<UserRefDto[]>([])

	const [selectedUserIds, setSelectedUserIds] = useState<Set<number>>(new Set())

	const [values, setValues] = useState<GridValues>({})

	// =========================
	// UPDATE ENTRY
	// =========================

	const updateEntry = (index: number, hours: number) => {
		setEntries((prev) => {
			const copy = [...prev]

			copy[index] = {
				...copy[index],
				hours,
			}

			return copy
		})
	}

	// =========================
	// CONTEXT VALUE
	// =========================

	const value = useMemo<IEtcContext>(
		() => ({
			projectId,

			entries,
			setEntries,

			updateEntry,

			errors,
			setErrors,

			loading,
			setLoading,

			projectName,
			setProjectName,

			bac,
			setBac,

			search,
			setSearch,

			selectedMonths,
			setSelectedMonths,

			monthToAdd,
			setMonthToAdd,

			users,
			setUsers,

			selectedUserIds,
			setSelectedUserIds,

			values,
			setValues,
		}),
		[projectId, entries, errors, loading, projectName, bac, search, selectedMonths, monthToAdd, users, selectedUserIds, values]
	)

	return <etcContext.Provider value={value}>{children}</etcContext.Provider>
}
