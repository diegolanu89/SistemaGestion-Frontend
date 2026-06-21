// context/EtcContext.tsx

import { useEffect, useMemo, useState, ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

import type { EtcEntryDto, EtcRecordDto } from '../model/Etc.m'
import type { EtcSnapshotDto } from '../model/IEtcApi.m'
import type { IEtcContext, GridValues } from '../model/IEtcContext.m'

import { etcContext } from '../hooks/useEtcContext.h'

import type { UserRefDto } from '../../EstimatedProjects/models/EstimatedProjectDTO.m'

import { monthKeyOf } from '../../EstimatedProjects/utils/months'

import { proyectViewAdapter } from '../../ViewProyect/services/ProyectViewAdapter.s'
import { userAdapter } from '../service/UserRefAdapter'
import { etcAdapter } from '../service/EtcAdapter'

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'

interface Props {
	children: ReactNode
}

export const EtcProvider = ({ children }: Props) => {
	const location = useLocation()

	const initialProjectId = Number(location.state?.projectId ?? 0)

	const [projectId, setProjectId] = useState<number>(initialProjectId)

	// =========================
	// BASE ETC
	// =========================

	const [snapshot, setSnapshot] = useState<EtcSnapshotDto | null>(null)

	const [records, setRecords] = useState<EtcRecordDto[]>([])

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
	// INITIAL DATA LOAD
	// =========================

	useEffect(() => {
		if (!projectId) {
			return
		}

		let cancelled = false

		void (async () => {
			setLoading(true)

			try {
				const project = await proyectViewAdapter.getById(projectId)

				if (cancelled) return

				setProjectName(project.name)

				setBac(Number(project.bacBaseHours ?? 0))

				const allUsers = await userAdapter.getUsers()

				if (cancelled) return

				setUsers(allUsers)

				const response = await etcAdapter.getByProject(projectId)

				if (cancelled) return

				setSnapshot(response.snapshot)

				const rawRecords = response.records ?? []

				if (!cancelled) setRecords(rawRecords)

				const mappedEntries: EtcEntryDto[] = rawRecords.map(
					(record: { userName?: string | null; monthKey: string; monthLabel?: string | null; hours?: number | null }) => ({
						userName: record.userName ?? 'Sin usuario',

						monthKey: record.monthKey,

						monthLabel: record.monthLabel ?? record.monthKey,

						hours: Number(record.hours ?? 0),
					})
				)

				if (!cancelled) setEntries(mappedEntries)

				const monthSet = new Set<string>()

				mappedEntries.forEach((r) => monthSet.add(r.monthKey))

				if (monthSet.size > 0) {
					setSelectedMonths(Array.from(monthSet).sort())
				} else {
					setSelectedMonths([monthKeyOf(new Date())])
				}

				const ids = new Set<number>()

				const nextValues: GridValues = {}

				allUsers.forEach((u) => {
					const userRecords = mappedEntries.filter((r) => r.userName === u.FullName)

					if (userRecords.length <= 0) {
						return
					}

					ids.add(u.Id)

					nextValues[u.Id] = {}

					userRecords.forEach((r) => {
						nextValues[u.Id][r.monthKey] = Number(r.hours)
					})
				})

				if (!cancelled) {
					setSelectedUserIds(ids)

					setValues(nextValues)
				}
			} catch (e: unknown) {
				logger.errorTag(LogTag.Adapter, '[ETC PROVIDER] Load error', e)
			} finally {
				if (!cancelled) {
					setLoading(false)
				}
			}
		})()

		return () => {
			cancelled = true
		}
	}, [projectId])

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
			setProjectId,

			snapshot,
			setSnapshot,

			records,
			setRecords,

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
		[projectId, snapshot, records, entries, errors, loading, projectName, bac, search, selectedMonths, monthToAdd, users, selectedUserIds, values]
	)

	return <etcContext.Provider value={value}>{children}</etcContext.Provider>
}
