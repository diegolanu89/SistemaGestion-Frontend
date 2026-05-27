import { HttpClient } from '../../base/services/HttpClient.s'
import type { UserVacationPeriodDto, VacationEntryInput } from '../models/Vacaciones.m'

const BASE_URL = import.meta.env.VITE_API_URL

export const vacacionesBDT = {
	async list(): Promise<UserVacationPeriodDto[]> {
		const res = await HttpClient.request<UserVacationPeriodDto[]>(`${BASE_URL}/user-vacation-periods`)
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
