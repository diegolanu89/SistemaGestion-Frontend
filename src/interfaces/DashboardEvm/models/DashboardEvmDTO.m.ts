import { ProjectDto } from '../../ViewProyect/models/ProyectViewDTO.m'

/**
 * Row del dashboard EVM. Extiende ProjectDto con el campo `changesCount`
 * que viene del módulo "Seguimiento de Proyectos" (historial de desvíos).
 *
 * TODO RF-10: coordinar con backend para que GET /projects/evm devuelva
 * `changesCount` por proyecto. Mientras tanto, el mock lo provee.
 */
export interface DashboardEvmRowDto extends ProjectDto {
	changesCount: number
}

export interface DashboardEvmResponse {
	data: DashboardEvmRowDto[]
	total: number
}
