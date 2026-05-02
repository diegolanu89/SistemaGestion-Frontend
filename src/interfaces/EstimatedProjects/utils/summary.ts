// utils/summary.ts

import { EstimatedProjectRecordDto } from '../models/EstimatedProjectDTO.m'

export interface ProjectSummary {
	totalHours: number
	totalResources: number
	totalMonths: number
}

export const computeSummary = (project: EstimatedProjectRecordDto): ProjectSummary => {
	const totalResources = project.Resources.length

	const months = new Set<string>()
	let totalHours = 0

	for (const resource of project.Resources) {
		for (const [month, hours] of Object.entries(resource.MonthlyHours)) {
			months.add(month)
			totalHours += hours
		}
	}

	return {
		totalHours,
		totalResources,
		totalMonths: months.size,
	}
}
