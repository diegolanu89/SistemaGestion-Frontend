// hooks/useEtcProjectController.h.ts

import { useCallback } from 'react'

import { useEtcContext } from './useEtcContext.h'

import { proyectViewAdapter } from '../../ViewProyect/services/ProyectViewAdapter.s'
import { userAdapter } from '../service/UserRefAdapter'
import { etcAdapter } from '../service/EtcAdapter'

import { monthKeyOf } from '../../EstimatedProjects/utils/months'

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'

import type { GridValues } from '../model/IEtcContext.m'
import type { EtcEntryDto } from '../model/Etc.m'

export const useEtcProjectController = () => {
	const {
		setProjectId,

		setProjectName,

		setBac,

		setUsers,

		setLoading,

		setSelectedMonths,

		setSelectedUserIds,

		setValues,

		setErrors,

		setEntries,
	} = useEtcContext()

	const loadProject = useCallback(
		async (projectId: number): Promise<void> => {
			if (!projectId) {
				return
			}

			try {
				setLoading(true)

				logger.infoTag(LogTag.Adapter, '[ETC PROJECT] Loading project', {
					projectId,
				})

				// =========================
				// PROJECT
				// =========================

				const project = await proyectViewAdapter.getById(projectId)

				setProjectId(project.id)

				setProjectName(project.name)

				setBac(Number(project.bacBaseHours ?? 0))

				// =========================
				// USERS
				// =========================

				const allUsers = await userAdapter.getUsers()

				setUsers(allUsers)

				// =========================
				// ETC
				// =========================

				const response = await etcAdapter.getByProject(projectId)

				const records = response.records ?? []

				// =========================
				// ENTRIES (EtcSummary / EtcTable)
				// =========================

				const mappedEntries: EtcEntryDto[] = records.map((record) => ({
					userName: record.userName ?? 'Sin usuario',

					monthKey: record.monthKey,

					monthLabel: record.monthLabel ?? record.monthKey,

					hours: Number(record.hours ?? 0),
				}))

				setEntries(mappedEntries)

				// =========================
				// MONTHS
				// =========================

				const monthSet = new Set<string>()

				records.forEach((record) => {
					monthSet.add(record.monthKey)
				})

				if (monthSet.size > 0) {
					setSelectedMonths(Array.from(monthSet).sort())
				} else {
					setSelectedMonths([monthKeyOf(new Date())])
				}

				// =========================
				// GRID
				// =========================

				const ids = new Set<number>()

				const nextValues: GridValues = {}

				allUsers.forEach((user) => {
					const userRecords = records.filter((record) => record.userName === user.FullName)

					if (userRecords.length <= 0) {
						return
					}

					ids.add(user.Id)

					nextValues[user.Id] = {}

					userRecords.forEach((record) => {
						nextValues[user.Id][record.monthKey] = Number(record.hours ?? 0)
					})
				})

				setSelectedUserIds(ids)

				setValues(nextValues)

				setErrors([])

				logger.infoTag(LogTag.Adapter, '[ETC PROJECT] Load success', {
					projectId,
					users: allUsers.length,
					records: records.length,
				})
			} catch (error: unknown) {
				logger.errorTag(LogTag.Adapter, '[ETC PROJECT] Load error', error)

				setErrors([
					{
						message: 'Error al cargar el proyecto seleccionado',
					},
				])

				setEntries([])

				setSelectedUserIds(new Set())

				setValues({})
			} finally {
				setLoading(false)
			}
		},
		[setProjectId, setProjectName, setBac, setUsers, setLoading, setSelectedMonths, setSelectedUserIds, setValues, setErrors, setEntries]
	)

	return {
		loadProject,
	}
}
