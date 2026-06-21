import { useEffect, useState } from 'react'
import { ProjectHoursResponseDto } from '../models/ProyectViewInterface.m'
import { proyectViewAdapter } from '../services/ProyectViewAdapter.s'

interface Params {
	projectId: number
	open: boolean
}

export const useProjectHours = ({ projectId, open }: Params) => {
	const [loading, setLoading] = useState(false)

	const [hoursData, setHoursData] = useState<ProjectHoursResponseDto | null>(null)

	useEffect(() => {
		if (!open || hoursData) return

		const loadProjectHours = async () => {
			try {
				setLoading(true)

				const start = Date.now()

				const response = await proyectViewAdapter.getProjectHours(projectId)

				const elapsed = Date.now() - start

				const remaining = Math.max(1500 - elapsed, 0)

				await new Promise((resolve) => setTimeout(resolve, remaining))

				setHoursData(response)
			} catch (error) {
				console.error('ERROR PROJECT HOURS', error)
			} finally {
				setLoading(false)
			}
		}

		void loadProjectHours()
	}, [open, projectId, hoursData])

	return {
		loading,
		hoursData,
	}
}
