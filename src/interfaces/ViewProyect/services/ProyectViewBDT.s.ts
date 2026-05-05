import { ProjectDto, UpdateBacDto } from '../models/ProyectViewDTO.m'
import { ProjectPaginatedResponse, ProyectViewInterface, RecalculateHoursResponse, UpdateBacResponse } from '../models/ProyectViewInterface.m'

const BASE_URL = `${import.meta.env.VITE_API_URL}/projects`

export class ProyectViewBDT implements ProyectViewInterface {
	private getAuthHeaders(): HeadersInit {
		const token = localStorage.getItem('authUser')

		return token
			? {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				}
			: {
					'Content-Type': 'application/json',
				}
	}

	async getAll(params?: { page?: number; per_page?: number; only_visible?: boolean }): Promise<ProjectPaginatedResponse> {
		const query = new URLSearchParams()

		if (params?.page) query.append('page', String(params.page))
		if (params?.per_page) query.append('per_page', String(params.per_page))
		if (params?.only_visible !== undefined) {
			query.append('only_visible', params.only_visible ? 'true' : 'false')
		}

		const res = await fetch(`${BASE_URL}?${query.toString()}`, {
			headers: this.getAuthHeaders(),
		})

		if (!res.ok) throw new Error(`Error al obtener proyectos (${res.status})`)

		return res.json()
	}

	async getEvm(): Promise<ProjectPaginatedResponse> {
		const res = await fetch(`${BASE_URL}/evm`, {
			headers: this.getAuthHeaders(),
		})

		if (!res.ok) throw new Error(`Error al obtener proyectos EVM (${res.status})`)

		return res.json()
	}

	async getById(id: number): Promise<ProjectDto> {
		const res = await fetch(`${BASE_URL}/${id}`, {
			headers: this.getAuthHeaders(),
		})

		if (!res.ok) throw new Error(`Proyecto no encontrado (${res.status})`)

		return res.json()
	}

	async updateBac(id: number, data: UpdateBacDto): Promise<UpdateBacResponse> {
		const res = await fetch(`${BASE_URL}/${id}/bac`, {
			method: 'PATCH',
			headers: this.getAuthHeaders(),
			body: JSON.stringify(data),
		})

		if (!res.ok) throw new Error(`Error al actualizar BAC (${res.status})`)

		return res.json()
	}

	async recalculateHours(id: number): Promise<RecalculateHoursResponse> {
		const res = await fetch(`${BASE_URL}/${id}/recalculate-hours`, {
			method: 'POST',
			headers: this.getAuthHeaders(),
		})

		if (!res.ok) throw new Error(`Error al recalcular horas (${res.status})`)

		return res.json()
	}
}
