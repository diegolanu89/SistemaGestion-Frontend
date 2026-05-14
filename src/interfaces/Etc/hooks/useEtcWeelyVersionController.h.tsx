// hooks/useEtcWeeklyVersionController.h.ts

import { useCallback, useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'

import { etcAdapter } from '../service/EtcAdapter'

import { userAdapter } from '../../Users/service/UserRefAdapter'

import type { EtcEntryDto } from '../model/Etc.m'

import { monthKeyOf } from '../../EstimatedProjects/utils/months'

import { proyectViewAdapter } from '../../ViewProyect/services/ProyectViewAdapter.s'

import type { ProjectDto } from '../../ViewProyect/models/ProyectViewDTO.m'

import { useEtcContext } from './useEtcContext.h'

interface GridValues {
	[userId: number]: Record<string, number>
}

export const useEtcWeeklyVersionController = () => {
	const navigate = useNavigate()

	const location = useLocation()

	const projectId = Number(location.state?.projectId)

	const {
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
	} = useEtcContext()

	// =========================
	// INITIAL LOAD
	// =========================

	useEffect(() => {
		let cancelled = false

		void (async () => {
			setLoading(true)

			try {
				const project: ProjectDto = await proyectViewAdapter.getById(projectId)

				if (cancelled) {
					return
				}

				setProjectName(project.name)

				setBac(Number(project.bacTotalHours ?? 0))

				const allUsers = await userAdapter.getUsers()

				if (cancelled) {
					return
				}

				setUsers(allUsers)

				const response = await etcAdapter.getByProject(projectId)

				if (cancelled) {
					return
				}

				const records: EtcEntryDto[] = (response.records ?? []).map(
					(record: { userName?: string | null; monthKey: string; monthLabel?: string | null; hours?: number | null }) => ({
						userName: record.userName ?? 'Sin usuario',

						monthKey: record.monthKey,

						monthLabel: record.monthLabel ?? record.monthKey,

						hours: Number(record.hours ?? 0),
					})
				)

				const monthSet = new Set<string>()

				records.forEach((r) => {
					monthSet.add(r.monthKey)
				})

				if (monthSet.size > 0) {
					setSelectedMonths(Array.from(monthSet).sort())
				} else {
					setSelectedMonths([monthKeyOf(new Date())])
				}

				const ids = new Set<number>()

				const nextValues: GridValues = {}

				allUsers.forEach((u) => {
					const userRecords = records.filter((r) => r.userName === u.FullName)

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
				logger.errorTag(LogTag.Adapter, '[ETC WEEKLY] Load error', e)
			} finally {
				if (!cancelled) {
					setLoading(false)
				}
			}
		})()

		return () => {
			cancelled = true
		}
	}, [projectId, setLoading, setProjectName, setBac, setUsers, setSelectedMonths, setSelectedUserIds, setValues])

	// =========================
	// FILTERED USERS
	// =========================

	const filteredUsers = useMemo(() => {
		const term = search.toLowerCase().trim()

		if (!term) {
			return users
		}

		return users.filter((u) => u.FullName.toLowerCase().includes(term) || u.Username.toLowerCase().includes(term))
	}, [search, users])

	// =========================
	// SELECTED USERS
	// =========================

	const selectedUsers = useMemo(() => {
		return users.filter((u) => selectedUserIds.has(u.Id))
	}, [users, selectedUserIds])

	// =========================
	// ERC
	// =========================

	const erc = useMemo(() => {
		return Object.values(values).reduce(
			(acc: number, months: Record<string, number>) => acc + Object.values(months).reduce((a: number, b: number) => a + b, 0),
			0
		)
	}, [values])

	// =========================
	// USE %
	// =========================

	const usePercentage = useMemo(() => {
		if (bac <= 0) {
			return 0
		}

		return (erc / bac) * 100
	}, [erc, bac])

	// =========================
	// RANGE LABEL
	// =========================

	const rangeLabel = useMemo(() => {
		if (selectedMonths.length === 0) {
			return ''
		}

		const ordered = [...selectedMonths].sort()

		return `${ordered[0]} → ${ordered[ordered.length - 1]}`
	}, [selectedMonths])

	// =========================
	// TOGGLE USER
	// =========================

	const toggleUser = useCallback(
		(userId: number) => {
			setSelectedUserIds((prev) => {
				const next = new Set(prev)

				if (next.has(userId)) {
					next.delete(userId)
				} else {
					next.add(userId)
				}

				return next
			})
		},
		[setSelectedUserIds]
	)

	// =========================
	// UPDATE HOURS
	// =========================

	const updateHours = useCallback(
		(userId: number, month: string, value: number) => {
			setValues((prev) => ({
				...prev,

				[userId]: {
					...(prev[userId] ?? {}),

					[month]: value,
				},
			}))
		},
		[setValues]
	)

	// =========================
	// ADD MONTH
	// =========================

	const addMonth = useCallback(() => {
		if (selectedMonths.includes(monthToAdd)) {
			return
		}

		setSelectedMonths((prev) => [...prev, monthToAdd].sort())
	}, [monthToAdd, selectedMonths, setSelectedMonths])

	// =========================
	// REMOVE MONTH
	// =========================

	const removeMonth = useCallback(
		(month: string) => {
			setSelectedMonths((prev) => prev.filter((m) => m !== month))
		},
		[setSelectedMonths]
	)

	// =========================
	// SAVE SNAPSHOT
	// =========================

	const saveSnapshot = useCallback(async () => {
		try {
			setLoading(true)

			const entries: EtcEntryDto[] = []

			selectedUsers.forEach((u) => {
				selectedMonths.forEach((month) => {
					const hours = values[u.Id]?.[month] ?? 0

					if (hours <= 0) {
						return
					}

					entries.push({
						userName: u.FullName,

						monthKey: month,

						monthLabel: month,

						hours,
					})
				})
			})

			await etcAdapter.createSnapshot(projectId, {
				entries,
			})

			logger.infoTag(LogTag.Adapter, '[ETC WEEKLY] Snapshot created', {
				projectId,

				entries: entries.length,
			})

			navigate(-1)
		} catch (e: unknown) {
			logger.errorTag(LogTag.Adapter, '[ETC WEEKLY] Save snapshot error', e)
		} finally {
			setLoading(false)
		}
	}, [projectId, selectedUsers, selectedMonths, values, navigate, setLoading])

	const handleBack = () => {
		navigate(-1)
	}

	return {
		projectId,

		projectName,

		bac,

		erc,

		usePercentage,

		loading,

		search,

		setSearch,

		users,

		filteredUsers,

		selectedUsers,

		selectedUserIds,

		selectedMonths,

		monthToAdd,

		setMonthToAdd,

		rangeLabel,

		values,

		toggleUser,

		updateHours,

		addMonth,

		removeMonth,

		saveSnapshot,

		handleBack,
		setLoading,
	}
}
