// ==========================
// 🔹 SELECT OPTION (GENÉRICO)
// ==========================

export interface SelectOption<T extends string = string> {
	value: T
	label: string
}

// ==========================
// 🔹 HELPERS MAPPERS (🔥 PRO)
// ==========================

import { ProjectIntakeStatusRefDto, ProjectIntakeCategoryRefDto, ProjectIntakeTypeRefDto } from '../models/ProyectDTO.m'

export const mapStatusOptions = (data: ProjectIntakeStatusRefDto[]): SelectOption[] => {
	return data
		.filter((s) => s.IsActive)
		.map((s) => ({
			value: s.Code,
			label: s.Label,
		}))
}

export const mapCategoryOptions = (data: ProjectIntakeCategoryRefDto[]): SelectOption[] => {
	return data
		.filter((c) => c.IsActive)
		.map((c) => ({
			value: c.Code,
			label: c.Label,
		}))
}

export const mapTypeOptions = (data: ProjectIntakeTypeRefDto[]): SelectOption[] => {
	return data
		.filter((t) => t.IsActive)
		.map((t) => ({
			value: t.Code,
			label: t.Label,
		}))
}
