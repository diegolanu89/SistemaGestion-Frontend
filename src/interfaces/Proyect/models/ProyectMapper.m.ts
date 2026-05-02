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
		.filter((s) => s.isActive)
		.map((s) => ({
			value: s.code,
			label: s.label,
		}))
}

export const mapCategoryOptions = (data: ProjectIntakeCategoryRefDto[]): SelectOption[] => {
	return data
		.filter((c) => c.isActive)
		.map((c) => ({
			value: c.code,
			label: c.label,
		}))
}

export const mapTypeOptions = (data: ProjectIntakeTypeRefDto[]): SelectOption[] => {
	return data
		.filter((t) => t.isActive)
		.map((t) => ({
			value: t.code,
			label: t.label,
		}))
}
