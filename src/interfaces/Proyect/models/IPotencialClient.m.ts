import { PotencialClientDto, PotencialClientRequestDto } from './PotencialClientDTO.m'

export interface PotencialClientInterface {
	getAll(): Promise<PotencialClientDto[]>
	getById(id: number): Promise<PotencialClientDto>
	create(data: PotencialClientRequestDto): Promise<PotencialClientDto>
	update(id: number, data: PotencialClientRequestDto): Promise<PotencialClientDto>
	delete(id: number): Promise<void>
}
