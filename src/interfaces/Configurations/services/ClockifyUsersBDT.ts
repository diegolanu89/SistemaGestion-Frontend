import { HttpClient } from '../../base/services/HttpClient.s'
import type {
	ClockifyUserDto,
	ClockifyUserListResponse,
	ClockifyUserOptionsResponse,
	UserMonthlyCapacityEntry,
	CapacityListResponse,
	CreateClockifyUserDto,
	UpdateClockifyUserDto,
	SaveCapacitiesDto,
	UserOption,
} from '../models/ClockifyUser.m'

const BASE_URL = import.meta.env.VITE_API_URL

function buildQuery(params: Record<string, string | number | boolean | undefined>): string {
	const q = new URLSearchParams()
	for (const [k, v] of Object.entries(params)) {
		if (v !== undefined && v !== null && v !== '') q.set(k, String(v))
	}
	const s = q.toString()
	return s ? `?${s}` : ''
}

export const clockifyUsersBDT = {
	async list(params?: { search?: string; active?: boolean; per_page?: number; page?: number }): Promise<{
		users: ClockifyUserDto[]
		pagination: { total: number; per_page: number; current_page: number }
	}> {
		const qs = buildQuery({ ...params })
		const res = await HttpClient.request<ClockifyUserListResponse>(`${BASE_URL}/clockify-users${qs}`)
		const users = res.data?.data ?? []
		return {
			users,
			pagination: {
				total: res.data?.total ?? users.length,
				per_page: res.data?.per_page ?? users.length,
				current_page: res.data?.current_page ?? 1,
			},
		}
	},

	async getOptions(): Promise<UserOption[]> {
		const res = await HttpClient.request<ClockifyUserOptionsResponse>(`${BASE_URL}/clockify-users/options`)
		return res.data?.users ?? []
	},

	async create(payload: CreateClockifyUserDto): Promise<void> {
		await HttpClient.request(`${BASE_URL}/clockify-users`, {
			method: 'POST',
			body: JSON.stringify(payload),
		})
	},

	async update(id: number, payload: UpdateClockifyUserDto): Promise<void> {
		await HttpClient.request(`${BASE_URL}/clockify-users/${id}`, {
			method: 'PUT',
			body: JSON.stringify(payload),
		})
	},

	async remove(id: number): Promise<void> {
		await HttpClient.request(`${BASE_URL}/clockify-users/${id}`, { method: 'DELETE' })
	},

	async listCapacities(userId: number): Promise<UserMonthlyCapacityEntry[]> {
		const res = await HttpClient.request<CapacityListResponse>(`${BASE_URL}/clockify-users/${userId}/capacities`)
		return res.data ?? []
	},

	async saveCapacities(userId: number, entries: SaveCapacitiesDto['entries']): Promise<UserMonthlyCapacityEntry[]> {
		const res = await HttpClient.request<CapacityListResponse>(`${BASE_URL}/clockify-users/${userId}/capacities`, {
			method: 'POST',
			body: JSON.stringify({ entries }),
		})
		return res.data ?? []
	},

	async sync(): Promise<void> {
		await HttpClient.request(`${BASE_URL}/clockify/sync-users`, { method: 'POST' })
	},

	async syncProjects(): Promise<void> {
		await HttpClient.request(`${BASE_URL}/clockify/sync-projects`, { method: 'POST' })
	},
}
