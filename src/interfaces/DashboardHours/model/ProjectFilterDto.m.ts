// ==========================
// 🔹 DTO
// ==========================

import { ProjectDto } from '../../ViewProyect/models/ProyectViewDTO.m'

export interface ProjectFilterDto {
	Id: number

	ProjectId: number

	Name?: string | null

	CreatedAt?: string | null

	UpdatedAt?: string | null

	Project?: ProjectDto | null
}

// ==========================
// 🔹 CREATE DTO
// ==========================

export interface CreateProjectFilterDto {
	ProjectIds: number[]

	Name: string
}
