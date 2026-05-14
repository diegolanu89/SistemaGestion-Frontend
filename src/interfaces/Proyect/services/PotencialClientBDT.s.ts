/* eslint-disable @typescript-eslint/no-unused-vars */
import { PotencialClientInterface } from '../models/IPotencialClient.m'
import { PotencialClientDto, PotencialClientRequestDto } from '../models/PotencialClientDTO.m'

const BASE_URL = import.meta.env.VITE_API_URL

const ENDPOINT = `${BASE_URL}/project-intakes/options`

// ==========================
// 🔹 WIRE TYPES
// ==========================

interface PotencialClientWire {
	id: number
	name: string
	createdAt?: string | null
	updatedAt?: string | null
}

// ==========================
// 🔹 MAPPERS
// ==========================

const mapClient = (w: PotencialClientWire): PotencialClientDto => ({
	Id: w.id,
	Name: w.name,
	CreatedAt: w.createdAt ?? null,
	UpdatedAt: w.updatedAt ?? null,
})

export class PotencialClientBDT implements PotencialClientInterface {
	async getAll(): Promise<PotencialClientDto[]> {
		const res = await fetch(ENDPOINT, {
			credentials: 'include',
		})

		if (!res.ok) {
			throw new Error(`Error obteniendo clientes (status=${res.status})`)
		}

		const json = (await res.json()) as {
			success: boolean
			data: {
				clients: PotencialClientWire[]
			}
		}

		return json.data.clients.map(mapClient)
	}

	async getById(id: number): Promise<PotencialClientDto> {
		const all = await this.getAll()

		const found = all.find((c) => c.Id === id)

		if (!found) {
			throw new Error(`Cliente no encontrado (id=${id})`)
		}

		return found
	}

	// ==========================
	// 🔹 PLACEHOLDERS
	// ==========================

	async create(_data: PotencialClientRequestDto): Promise<PotencialClientDto> {
		throw new Error('create no disponible desde options endpoint')
	}

	async update(_id: number, _data: PotencialClientRequestDto): Promise<PotencialClientDto> {
		throw new Error('update no disponible desde options endpoint')
	}

	async delete(_id: number): Promise<void> {
		throw new Error('delete no disponible desde options endpoint')
	}
}
