import { PotencialClientInterface } from '../models/IPotencialClient.m'
import { PotencialClientDto, PotencialClientRequestDto } from '../models/PotencialClientDTO.m'

export class PotencialClientBDT implements PotencialClientInterface {
	private baseUrl = '/api/potencial-clients'

	async getAll(): Promise<PotencialClientDto[]> {
		const res = await fetch(this.baseUrl)

		if (!res.ok) throw new Error('Error obteniendo clientes')

		return (await res.json()) as PotencialClientDto[]
	}

	async getById(id: number): Promise<PotencialClientDto> {
		const res = await fetch(`${this.baseUrl}/${id}`)

		if (!res.ok) throw new Error('Cliente no encontrado')

		return (await res.json()) as PotencialClientDto
	}

	async create(data: PotencialClientRequestDto): Promise<PotencialClientDto> {
		const res = await fetch(this.baseUrl, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		})

		if (!res.ok) throw new Error('Error creando cliente')

		return (await res.json()) as PotencialClientDto
	}

	async update(id: number, data: PotencialClientRequestDto): Promise<PotencialClientDto> {
		const res = await fetch(`${this.baseUrl}/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		})

		if (!res.ok) throw new Error('Error actualizando cliente')

		return (await res.json()) as PotencialClientDto
	}

	async delete(id: number): Promise<void> {
		const res = await fetch(`${this.baseUrl}/${id}`, {
			method: 'DELETE',
		})

		if (!res.ok) throw new Error('Error eliminando cliente')
	}
}
