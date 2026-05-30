import { ProjectDto } from '../../ViewProyect/models/ProyectViewDTO.m'

/**
 * Row del dashboard EVM. Extiende ProjectDto con dos campos enriquecidos por
 * el controller a partir de llamadas N+1:
 *  - `changesCount`: cantidad de change requests del proyecto (columna "Control de cambios")
 *  - `hasTracking`:  el proyecto tiene tracking registrado (afecta el color del chip "S")
 *
 * TODO RF-10: pedir al back que devuelva ambos en /projects/evm o /metrics/batch
 * para evitar los N+1 que hace hoy el front.
 */
export interface DashboardEvmRowDto extends ProjectDto {
	changesCount: number
	hasTracking: boolean
}

export interface DashboardEvmResponse {
	data: DashboardEvmRowDto[]
	total: number
}
