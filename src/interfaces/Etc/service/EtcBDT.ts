import { CreateEtcRecordDto, UpdateEtcRecordDto, CreateSnapshotDto, BulkEtcDto, ValidateEtcCapacityDto } from '../model/Etc.m'
import { IEtcApi } from '../model/IEtcApi.m'

const BASE = '/api'

export class EtcBDT implements IEtcApi {
	async getByProject(projectId: number, snapshot?: 'baseline') {
		const url = `${BASE}/projects/${projectId}/etc${snapshot ? `?snapshot=${snapshot}` : ''}`
		const res = await fetch(url)
		return res.json()
	}

	async create(projectId: number, dto: CreateEtcRecordDto) {
		const res = await fetch(`${BASE}/projects/${projectId}/etc`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(dto),
		})
		return res.json()
	}

	async update(id: number, dto: UpdateEtcRecordDto) {
		const res = await fetch(`${BASE}/etc/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(dto),
		})
		return res.json()
	}

	async delete(id: number) {
		const res = await fetch(`${BASE}/etc/${id}`, { method: 'DELETE' })
		return res.json()
	}

	async deleteByProject(projectId: number) {
		const res = await fetch(`${BASE}/etc/project/${projectId}`, { method: 'DELETE' })
		return res.json()
	}

	async getProjectsSummary() {
		const res = await fetch(`${BASE}/etc/projects-summary`)
		return res.json()
	}

	async finalizeBaseline(projectId: number) {
		const res = await fetch(`${BASE}/projects/${projectId}/etc/finalize-baseline`, {
			method: 'POST',
		})
		return res.json()
	}

	async createSnapshot(projectId: number, dto: CreateSnapshotDto) {
		const res = await fetch(`${BASE}/projects/${projectId}/etc/snapshot`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(dto),
		})
		return res.json()
	}

	async storeBulk(dto: BulkEtcDto) {
		const res = await fetch(`${BASE}/etc/bulk`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(dto),
		})
		return res.json()
	}

	async validateCapacity(dto: ValidateEtcCapacityDto) {
		const res = await fetch(`${BASE}/etc/validate-capacity`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(dto),
		})
		return res.json()
	}

	async exportCapacities() {
		const res = await fetch(`${BASE}/etc/export-capacities`)
		return res.json()
	}
}
