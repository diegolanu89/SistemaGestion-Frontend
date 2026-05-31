import { HttpClient } from '../../base/services/HttpClient.s'
import type {
	WorkingDaysCalendarDto,
	WorkingDaysCalendarListResponse,
	CreateWorkingDaysCalendarDto,
	UpdateWorkingDaysCalendarDto,
} from '../models/WorkingDaysCalendar.m'

const BASE_URL = import.meta.env.VITE_API_URL

function buildQuery(params: Record<string, string | number | boolean | undefined>): string {
	const q = new URLSearchParams()
	for (const [k, v] of Object.entries(params)) {
		if (v !== undefined && v !== null && v !== '') q.set(k, String(v))
	}
	const s = q.toString()
	return s ? `?${s}` : ''
}

export const workingDaysCalendarBDT = {
	async list(params?: { year?: number; per_page?: number; page?: number }): Promise<WorkingDaysCalendarDto[]> {
		const qs = buildQuery({ ...params })
		const res = await HttpClient.request<WorkingDaysCalendarListResponse>(`${BASE_URL}/working-days-calendar${qs}`)
		return res.data?.data ?? []
	},

	async create(data: CreateWorkingDaysCalendarDto): Promise<void> {
		await HttpClient.request(`${BASE_URL}/working-days-calendar`, {
			method: 'POST',
			body: JSON.stringify(data),
		})
	},

	async update(id: number, data: UpdateWorkingDaysCalendarDto): Promise<void> {
		await HttpClient.request(`${BASE_URL}/working-days-calendar/${id}`, {
			method: 'PUT',
			body: JSON.stringify(data),
		})
	},

	async remove(id: number): Promise<void> {
		await HttpClient.request(`${BASE_URL}/working-days-calendar/${id}`, { method: 'DELETE' })
	},
}
