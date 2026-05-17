import { DashboardEvmInterface } from '../models/DashboardEvmInterface.m'
import { DashboardEvmResponse } from '../models/DashboardEvmDTO.m'
import { ProjectTrackingDto, TrackingHistoryEntry } from '../models/ProjectTrackingDTO.m'

import evmResponse from './mocks/evm.response.json'
import trackingResponse from './mocks/tracking.response.json'

const MOCK_LATENCY_MS = 400

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export class DashboardEvmMock implements DashboardEvmInterface {
	async getEvm(): Promise<DashboardEvmResponse> {
		await sleep(MOCK_LATENCY_MS)
		return evmResponse as DashboardEvmResponse
	}

	async getTracking(projectId: number): Promise<ProjectTrackingDto> {
		await sleep(MOCK_LATENCY_MS)

		const base = trackingResponse as ProjectTrackingDto

		const row = (evmResponse as DashboardEvmResponse).data.find((r) => r.id === projectId)
		const changesCount = row?.changesCount ?? 0

		const history: TrackingHistoryEntry[] = Array.from({ length: changesCount }).map((_, idx) => ({
			id: 1000 + idx,
			endDate: base.history[0]?.endDate ?? null,
			observations: idx === 0 && base.history[0] ? base.history[0].observations : `Cambio #${idx + 1} registrado por control de cambios.`,
			registeredAt: base.history[0]?.registeredAt ?? new Date().toISOString(),
		}))

		return {
			...base,
			projectId,
			projectName: row?.name ?? base.projectName,
			projectCode: row?.code ?? base.projectCode,
			startDate: row?.startDate ?? base.startDate,
			endDatePlanned: row?.endDatePlanned ?? base.endDatePlanned,
			endDateActual: row?.endDateActual ?? base.endDateActual,
			history,
		}
	}
}
