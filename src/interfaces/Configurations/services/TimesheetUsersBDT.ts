import { HttpClient } from '../../base/services/HttpClient.s'
import type {
	TimesheetUserDto,
	TimesheetUserListResponse,
	TimesheetUserOptionsResponse,
	UserMonthlyCapacityEntry,
	CapacityListResponse,
	CreateTimesheetUserDto,
	UpdateTimesheetUserDto,
	SaveCapacitiesDto,
	UserOption,
} from '../models/TimesheetUser.m'

const BASE_URL = import.meta.env.VITE_API_URL

function buildQuery(params: Record<string, string | number | boolean | undefined>): string {
	const q = new URLSearchParams()
	for (const [k, v] of Object.entries(params)) {
		if (v !== undefined && v !== null && v !== '') q.set(k, String(v))
	}
	const s = q.toString()
	return s ? `?${s}` : ''
}

export const timesheetUsersBDT = {
	async list(params?: { search?: string; active?: boolean; per_page?: number; page?: number }): Promise<{
		users: TimesheetUserDto[]
		pagination: { total: number; per_page: number; current_page: number }
	}> {
		const qs = buildQuery({ ...params })
		const res = await HttpClient.request<TimesheetUserListResponse>(`${BASE_URL}/timesheet-users${qs}`)
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
		const res = await HttpClient.request<TimesheetUserOptionsResponse>(`${BASE_URL}/timesheet-users/options`)
		return res.data?.users ?? []
	},

	async create(payload: CreateTimesheetUserDto): Promise<void> {
		await HttpClient.request(`${BASE_URL}/timesheet-users`, {
			method: 'POST',
			body: JSON.stringify(payload),
		})
	},

	async update(id: number, payload: UpdateTimesheetUserDto): Promise<void> {
		await HttpClient.request(`${BASE_URL}/timesheet-users/${id}`, {
			method: 'PUT',
			body: JSON.stringify(payload),
		})
	},

	async remove(id: number): Promise<void> {
		await HttpClient.request(`${BASE_URL}/timesheet-users/${id}`, { method: 'DELETE' })
	},

	async listCapacities(userId: number): Promise<UserMonthlyCapacityEntry[]> {
		const res = await HttpClient.request<CapacityListResponse>(`${BASE_URL}/timesheet-users/${userId}/capacities`)
		return res.data ?? []
	},

	async saveCapacities(userId: number, entries: SaveCapacitiesDto['entries']): Promise<UserMonthlyCapacityEntry[]> {
		const res = await HttpClient.request<CapacityListResponse>(`${BASE_URL}/timesheet-users/${userId}/capacities`, {
			method: 'POST',
			body: JSON.stringify({ entries }),
		})
		return res.data ?? []
	},

	async sync(): Promise<void> {
		await HttpClient.request(`${BASE_URL}/timesheet/sync-users`, { method: 'POST' })
	},

	async syncProjects(): Promise<void> {
		await HttpClient.request(`${BASE_URL}/timesheet/sync-projects`, { method: 'POST' })
	},
}
