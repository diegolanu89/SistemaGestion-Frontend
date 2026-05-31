import { HttpClient } from '../../base/services/HttpClient.s'
import type { UserVacationPeriodDto, VacationEntryInput } from '../models/Vacaciones.m'

const BASE_URL = import.meta.env.VITE_API_URL

function buildQuery(params: Record<string, string | number | boolean | undefined>): string {
	const q = new URLSearchParams()
	for (const [k, v] of Object.entries(params)) {
		if (v !== undefined && v !== null && v !== '') q.set(k, String(v))
	}
	const s = q.toString()
	return s ? `?${s}` : ''
}

export const vacacionesBDT = {
	async list(params?: { search?: string }): Promise<UserVacationPeriodDto[]> {
		const qs = buildQuery({ ...params })
		const res = await HttpClient.request<UserVacationPeriodDto[]>(`${BASE_URL}/user-vacation-periods${qs}`)
		return Array.isArray(res) ? res : []
	},

	async create(entries: VacationEntryInput[]): Promise<void> {
		await HttpClient.request(`${BASE_URL}/user-vacation-periods`, {
			method: 'POST',
			body: JSON.stringify({ entries }),
		})
	},

	async remove(id: number): Promise<void> {
		await HttpClient.request(`${BASE_URL}/user-vacation-periods/${id}`, { method: 'DELETE' })
	},
}
