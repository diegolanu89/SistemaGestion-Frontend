import { ProjectDto, UpdateBacDto } from '../models/ProyectViewDTO.m'
import { ProjectPaginatedResponse, ProyectViewInterface, RecalculateHoursResponse, UpdateBacResponse } from '../models/ProyectViewInterface.m'

const BASE_URL = '/api/projects'

export class ProyectViewBTS implements ProyectViewInterface {
	async getAll(params?: { page?: number; per_page?: number; only_visible?: boolean }): Promise<ProjectPaginatedResponse> {
		const query = new URLSearchParams()

		if (params?.page) query.append('page', String(params.page))
		if (params?.per_page) query.append('per_page', String(params.per_page))
		if (params?.only_visible !== undefined) {
			query.append('only_visible', params.only_visible ? 'true' : 'false')
		}

		const res = await fetch(`${BASE_URL}?${query.toString()}`)
		if (!res.ok) throw new Error('Error al obtener proyectos')
		return res.json()
	}

	async getEvm(): Promise<ProjectPaginatedResponse> {
		const res = await fetch(`${BASE_URL}/evm`)
		if (!res.ok) throw new Error('Error al obtener proyectos EVM')
		return res.json()
	}

	async getById(id: number): Promise<ProjectDto> {
		const res = await fetch(`${BASE_URL}/${id}`)
		if (!res.ok) throw new Error('Proyecto no encontrado')
		return res.json()
	}

	async updateBac(id: number, data: UpdateBacDto): Promise<UpdateBacResponse> {
		const res = await fetch(`${BASE_URL}/${id}/bac`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		})
		if (!res.ok) throw new Error('Error al actualizar BAC')
		return res.json()
	}

	async recalculateHours(id: number): Promise<RecalculateHoursResponse> {
		const res = await fetch(`${BASE_URL}/${id}/recalculate-hours`, {
			method: 'POST',
		})
		if (!res.ok) throw new Error('Error al recalcular horas')
		return res.json()
	}
}
