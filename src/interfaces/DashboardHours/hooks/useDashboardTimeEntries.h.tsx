// hooks/useDashboardTimeEntries.h.ts

import { useEffect, useState } from 'react'

import { DashboardHoursRowDto } from '../model/DashboardHoursDTO.m'

import { clockifySyncAdapter } from '../../ViewProyect/services/ClockifySyncAdapter.s'

interface Params {
	rows: DashboardHoursRowDto[]

	enabled: boolean
}

export const useDashboardTimeEntries = ({ rows, enabled }: Params) => {
	const [clockifyLoading, setClockifyLoading] = useState(false)

	const [clockifyData, setClockifyData] = useState<Record<number, unknown>>({})

	useEffect(() => {
		if (!enabled) return

		const loadClockifyHours = async () => {
			try {
				setClockifyLoading(true)

				const syncResponse = await clockifySyncAdapter.syncTimeEntriesAll()

				console.log('CLOCKIFY SYNC RESPONSE', syncResponse)

				const realProjects = [
					...new Set(
						rows
							.flatMap((row) => row.details)
							.filter((detail) => detail.project_type === 'R' && detail.project_id)
							.map((detail) => detail.project_id as number)
					),
				]

				const summaries = await Promise.all(
					realProjects.map(async (projectId) => {
						const response = await clockifySyncAdapter.getProjectHoursSummary(projectId)

						return {
							projectId,
							response,
						}
					})
				)

				const map: Record<number, unknown> = {}

				summaries.forEach((item) => {
					map[item.projectId] = item.response
				})

				setClockifyData(map)

				console.log('CLOCKIFY DASHBOARD DATA', map)
			} catch (error) {
				console.error('ERROR CLOCKIFY DASHBOARD', error)
			} finally {
				setClockifyLoading(false)
			}
		}

		void loadClockifyHours()
	}, [enabled, rows])

	return {
		clockifyLoading,

		clockifyData,
	}
}
