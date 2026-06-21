import { useEffect, useState } from 'react'
import { ClockifyProjectHoursSummaryDto } from '../models/IClockifySync.m'
import { clockifySyncAdapter } from '../services/ClockifySyncAdapter.s'

interface Params {
	projectId: number
	projectName: string
	open: boolean
}

export const useClockifyHours = ({ projectId, projectName, open }: Params) => {
	const [clockifyLoading, setClockifyLoading] = useState(false)

	const [clockifyHoursData, setClockifyHoursData] = useState<ClockifyProjectHoursSummaryDto | null>(null)

	useEffect(() => {
		if (!open) return

		const loadClockifyHours = async () => {
			try {
				setClockifyLoading(true)

				const syncResponse = await clockifySyncAdapter.syncTimeEntriesAll()

				console.log('CLOCKIFY SYNC RESPONSE', syncResponse)

				const response = await clockifySyncAdapter.getProjectHoursSummary(projectId)

				setClockifyHoursData(response)

				console.log('CLOCKIFY HOURS SUMMARY', {
					projectId,
					projectName,
					response,
				})
			} catch (error) {
				console.error('ERROR CLOCKIFY', error)
			} finally {
				setClockifyLoading(false)
			}
		}

		void loadClockifyHours()
	}, [open, projectId, projectName])

	return {
		clockifyLoading,
		clockifyHoursData,
	}
}
