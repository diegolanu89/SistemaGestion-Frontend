// models/ProyectDTO.m.ts

// ==========================
// 🔹 REF DTOs
// ==========================

export interface ProjectIntakeTypeRefDto {
	id: number
	code: string
	label: string
	description?: string
	internalLabel: string
	secondaryLabel: string
	registrationLabel: string
	requiresBusinessStatusDate: boolean
	requiresActualEndDate: boolean
	requiresCommercialFields: boolean
	isActive: boolean
}

export interface ProjectIntakeCategoryRefDto {
	id: number
	code: string
	label: string
	description?: string
	isActive: boolean
}

export interface ProjectIntakeStatusRefDto {
	id: number
	code: string
	label: string
	description?: string
	isActive: boolean
}

// ==========================
// 🔹 MAIN DTO
// ==========================

export interface ProjectIntakeRecordDto {
	id: number
	projectType?: string | null
	internalProjectNumber?: string | null
	secondaryProjectNumber?: string | null
	registrationDate?: string | null
	clientId?: number | null
	clientName?: string | null
	projectName?: string | null
	categoryCode?: string | null
	projectStatusCode?: string | null
	businessStatusDate?: string | null
	estimatedEndDate?: string | null
	actualEndDate?: string | null
	commercialStatus?: string | null
	leaderName?: string | null
	observations?: string | null
	requiresClockifyCreation: boolean
	clockifyRecordId?: number | null
	isActive: boolean
	createdBy?: number | null
	updatedBy?: number | null
	createdAt?: string | null
	updatedAt?: string | null

	typeRef?: ProjectIntakeTypeRefDto | null
	categoryRef?: ProjectIntakeCategoryRefDto | null
	statusRef?: ProjectIntakeStatusRefDto | null

	clockifyProjectName?: string | null
}

// ==========================
// 🔹 REQUEST DTOs
// ==========================

export interface CreateProjectIntakeDto {
	projectType: string
	secondaryProjectNumber?: string
	registrationDate?: string
	clientId?: number
	projectName: string
	categoryCode?: string
	projectStatusCode?: string
	businessStatusDate?: string
	estimatedEndDate?: string
	actualEndDate?: string
	commercialStatus?: string
	leaderName?: string
	observations?: string
	requiresClockifyCreation?: boolean
}

export interface UpdateProjectIntakeDto {
	secondaryProjectNumber?: string
	registrationDate?: string
	clientId?: number
	projectName?: string
	categoryCode?: string
	projectStatusCode?: string
	businessStatusDate?: string
	estimatedEndDate?: string
	actualEndDate?: string
	commercialStatus?: string
	leaderName?: string
	observations?: string
}
