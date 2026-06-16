// hooks/useEtcWeeklyVersionController.h.ts

import { useCallback, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'

import { etcAdapter } from '../service/EtcAdapter'

import type { EtcEntryDto } from '../model/Etc.m'

import { useEtcContext } from './useEtcContext.h'

export const useEtcWeeklyVersionController = () => {
	const navigate = useNavigate()

	const location = useLocation()

	const projectId = Number(location.state?.projectId)

	const {
		loading,
		setLoading,

		projectName,

		bac,

		search,
		setSearch,

		selectedMonths,
		setSelectedMonths,

		monthToAdd,
		setMonthToAdd,

		users,

		selectedUserIds,
		setSelectedUserIds,

		values,
		setValues,
	} = useEtcContext()

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

	// =========================
	// ADD MONTH DIRECT
	// =========================

	const addMonthDirect = useCallback(
		(month: string) => {
			if (!month) {
				return
			}

			setSelectedMonths((prev) => {
				if (prev.includes(month)) {
					return prev
				}

				return [...prev, month].sort()
			})
		},
		[setSelectedMonths]
	)

	// =========================
	// ADD MULTIPLE MONTHS
	// =========================

	const addMultipleMonths = useCallback(
		(months: string[]) => {
			if (months.length === 0) {
				return
			}

			setSelectedMonths((prev) => {
				const next = new Set(prev)

				months.forEach((month) => {
					if (month) {
						next.add(month)
					}
				})

				return Array.from(next).sort()
			})
		},
		[setSelectedMonths]
	)

	// =========================
	// CLEAR MONTHS
	// =========================

	const clearMonths = useCallback(() => {
		setSelectedMonths([])
	}, [setSelectedMonths])

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
		addMonthDirect,
		addMultipleMonths,

		removeMonth,
		clearMonths,

		saveSnapshot,

		handleBack,

		setLoading,
	}
}
