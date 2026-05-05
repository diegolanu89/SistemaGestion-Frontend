import { PotencialClientInterface } from '../models/IPotencialClient.m'
import { PotencialClientDto, PotencialClientRequestDto } from '../models/PotencialClientDTO.m'

let db: PotencialClientDto[] = [
	{ Id: 1, Name: 'Banco Galicia' },
	{ Id: 2, Name: 'YPF' },
	{ Id: 3, Name: 'Mercado Libre' },
]

let idCounter = 4

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export class PotencialClientMock implements PotencialClientInterface {
	async getAll(): Promise<PotencialClientDto[]> {
		await delay(300)
		return [...db]
	}

	async getById(id: number): Promise<PotencialClientDto> {
		await delay(200)

		const found = db.find((c) => c.Id === id)
		if (!found) throw new Error('Cliente no encontrado')

		return found
	}

	async create(data: PotencialClientRequestDto): Promise<PotencialClientDto> {
		await delay(300)

		const newClient: PotencialClientDto = {
			Id: idCounter++,
			Name: data.Name,
		}

		db.push(newClient)
		return newClient
	}

	async update(id: number, data: PotencialClientRequestDto): Promise<PotencialClientDto> {
		await delay(300)

		const index = db.findIndex((c) => c.Id === id)
		if (index === -1) throw new Error('Cliente no encontrado')

		db[index].Name = data.Name
		return db[index]
	}

	async delete(id: number): Promise<void> {
		await delay(200)
		db = db.filter((c) => c.Id !== id)
	}
}
