import { HttpClient } from '../../base/services/HttpClient.s'
import type { ProfileDto, AppUserDto, CreateAppUserDto, UpdateAppUserDto } from '../models/AppUser.m'

const BASE_URL = import.meta.env.VITE_API_URL

function buildQuery(params: Record<string, string | number | boolean | undefined>): string {
	const q = new URLSearchParams()
	for (const [k, v] of Object.entries(params)) {
		if (v !== undefined && v !== null && v !== '') q.set(k, String(v))
	}
	const s = q.toString()
	return s ? `?${s}` : ''
}

export const appUsersBDT = {
	async listProfiles(): Promise<ProfileDto[]> {
		const res = await HttpClient.request<ProfileDto[]>(`${BASE_URL}/app/profiles`)
		return Array.isArray(res) ? res : []
	},

	async listUsers(params?: { search?: string }): Promise<AppUserDto[]> {
		const qs = buildQuery({ ...params })
		const res = await HttpClient.request<AppUserDto[]>(`${BASE_URL}/app/users${qs}`)
		return Array.isArray(res) ? res : []
	},

	async create(payload: CreateAppUserDto): Promise<AppUserDto> {
		return HttpClient.request<AppUserDto>(`${BASE_URL}/app/users`, {
			method: 'POST',
			body: JSON.stringify(payload),
		})
	},

	async update(id: number, payload: UpdateAppUserDto): Promise<AppUserDto> {
		return HttpClient.request<AppUserDto>(`${BASE_URL}/app/users/${id}`, {
			method: 'PUT',
			body: JSON.stringify(payload),
		})
	},

	async remove(id: number): Promise<void> {
		await HttpClient.request(`${BASE_URL}/app/users/${id}`, { method: 'DELETE' })
	},
}
