import { DashboardEvmInterface } from '../models/DashboardEvmInterface.m'
import { DashboardEvmResponse } from '../models/DashboardEvmDTO.m'
import { ProjectMetricsDto } from '../models/ProjectMetricsDTO.m'
import { ProjectTrackingDto, ProjectTrackingUpdateDto } from '../models/ProjectTrackingDTO.m'

import { calcAc, calcEac, calcEtc, calcVac } from '../../base/utils/evmCalculations'

import evmResponse from './mocks/evm.response.json'
import trackingResponse from './mocks/tracking.response.json'

const MOCK_LATENCY_MS = 400

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export class DashboardEvmMock implements DashboardEvmInterface {
	async getEvm(): Promise<DashboardEvmResponse> {
		await sleep(MOCK_LATENCY_MS)
		return evmResponse as DashboardEvmResponse
	}

	async getMetricsBatch(projectIds: number[]): Promise<ProjectMetricsDto[]> {
		await sleep(MOCK_LATENCY_MS)

		const rows = (evmResponse as DashboardEvmResponse).data

		return projectIds
			.map((id) => rows.find((r) => r.id === id))
			.filter((r): r is NonNullable<typeof r> => r != null)
			.map<ProjectMetricsDto>((row) => {
				const ac = calcAc(row)
				const etc = calcEtc(row)
				const eac = calcEac(row)
				const vac = calcVac(row)

				return {
					project_id: row.id,
					project_name: row.name,
					hours: {
						bac_base_hours: row.bacBaseHours,
						bac_total_hours: row.bacTotalHours,
						ac_hours_base: ac,
						ac_hours_cc: 0,
						ac_hours_total: ac,
						etc_hours: etc,
						eac_hours: eac,
						vac_hours: vac,
					},
					cost: {
						hourly_rate: row.hourlyRate,
						ac_cost: ac * row.hourlyRate,
						etc_cost: etc * row.hourlyRate,
						eac_cost: eac * row.hourlyRate,
						vac_cost: vac * row.hourlyRate,
					},
				}
			})
	}

	async getTracking(projectId: number): Promise<ProjectTrackingDto | null> {
		await sleep(MOCK_LATENCY_MS)

		const row = (evmResponse as DashboardEvmResponse).data.find((r) => r.id === projectId)
		if (!row) return null

		const changesCount = row.changesCount ?? 0
		const base = trackingResponse as ProjectTrackingDto

		const updates: ProjectTrackingUpdateDto[] = Array.from({ length: changesCount }).map((_, idx) => ({
			id: 1000 + projectId * 10 + idx,
			projectTrackingId: projectId,
			changeEndDate: base.updates[0]?.changeEndDate ?? null,
			observations: idx === 0 && base.updates[0] ? base.updates[0].observations : `Cambio #${idx + 1} registrado por control de cambios.`,
			createdAt: base.updates[0]?.createdAt ?? new Date().toISOString(),
			updatedAt: base.updates[0]?.updatedAt ?? new Date().toISOString(),
		}))

		return {
			...base,
			id: projectId,
			projectId,
			startDate: row.startDate ?? base.startDate,
			plannedEndDate: row.endDatePlanned ?? base.plannedEndDate,
			actualEndDate: row.endDateActual ?? base.actualEndDate,
			updates,
		}
	}
}
