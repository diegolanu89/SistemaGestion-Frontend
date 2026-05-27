import { HttpClient } from '../../base/services/HttpClient.s'
import type {
	UserLeaderDto,
	UserLeaderListResponse,
	UserLeaderOptionsResponse,
	CreateUserLeaderDto,
	UpdateUserLeaderDto,
	BulkUserLeaderDto,
} from '../models/UserLeader.m'

const BASE_URL = import.meta.env.VITE_API_URL

function buildQuery(params: Record<string, string | number | boolean | undefined>): string {
	const q = new URLSearchParams()
	for (const [k, v] of Object.entries(params)) {
		if (v !== undefined && v !== null && v !== '') q.set(k, String(v))
	}
	const s = q.toString()
	return s ? `?${s}` : ''
}

export const userLeadersBDT = {
	async list(params?: { per_page?: number; page?: number }): Promise<UserLeaderDto[]> {
		const qs = buildQuery({ ...params })
		const res = await HttpClient.request<UserLeaderListResponse>(`${BASE_URL}/user-leaders${qs}`)
		return res.data?.data ?? []
	},

	async getOptions(): Promise<Array<{ id: number; name: string; email: string }>> {
		const res = await HttpClient.request<UserLeaderOptionsResponse>(`${BASE_URL}/user-leaders/options`)
		return res.data?.users ?? []
	},

	async create(data: CreateUserLeaderDto): Promise<void> {
		await HttpClient.request(`${BASE_URL}/user-leaders`, {
			method: 'POST',
			body: JSON.stringify(data),
		})
	},

	async createBulk(data: BulkUserLeaderDto): Promise<void> {
		await HttpClient.request(`${BASE_URL}/user-leaders/bulk`, {
			method: 'POST',
			body: JSON.stringify(data),
		})
	},

	async update(id: number, data: UpdateUserLeaderDto): Promise<void> {
		await HttpClient.request(`${BASE_URL}/user-leaders/${id}`, {
			method: 'PUT',
			body: JSON.stringify(data),
		})
	},

	async remove(id: number): Promise<void> {
		await HttpClient.request(`${BASE_URL}/user-leaders/${id}`, { method: 'DELETE' })
	},
}
