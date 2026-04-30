// utils/capacity.ts

import { MonthlyCapacityDto, UserAssignmentDto, UserMonthWorkloadDto } from '../models/EstimatedProjectDTO.m'

/** Mapa rápido user → mes → asignaciones existentes (R + E) */
export type WorkloadMap = Map<number, Map<string, UserAssignmentDto[]>>

export const buildWorkloadMap = (workload: UserMonthWorkloadDto[]): WorkloadMap => {
	const map: WorkloadMap = new Map()
	for (const entry of workload) {
		if (!map.has(entry.UserId)) map.set(entry.UserId, new Map())
		map.get(entry.UserId)!.set(entry.MonthKey, entry.Assignments)
	}
	return map
}

export const buildCapacityMap = (capacities: MonthlyCapacityDto[]): Map<string, number> => {
	const map = new Map<string, number>()
	for (const c of capacities) map.set(c.MonthKey, c.AvailableHours)
	return map
}

export const sumAssignmentHours = (assignments: UserAssignmentDto[] | undefined): number => {
	if (!assignments) return 0
	return assignments.reduce((acc, a) => acc + a.Hours, 0)
}

/** Máx. horas asignables = capacidad - (ETC + estimados existentes), clamp en 0. */
export const computeMaxAssignable = (capacity: number, assignments: UserAssignmentDto[] | undefined): number => {
	const used = sumAssignmentHours(assignments)
	return Math.max(0, capacity - used)
}
