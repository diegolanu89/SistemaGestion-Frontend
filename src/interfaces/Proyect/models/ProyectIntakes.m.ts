import { ProjectIntakeTypeRefDto, ProjectIntakeCategoryRefDto, ProjectIntakeStatusRefDto, ProjectIntakeRecordDto, ProjectIntakeTrackingRef } from './ProyectDTO.m'

export interface ProjectIntakeTypeRefWire {
	id: number
	code: string
	label: string
	description?: string
	internalLabel: string
	secondaryLabel: string
	registrationLabel: string
	requiresBusinessStatusDate?: boolean
	requiresActualEndDate?: boolean
	requiresCommercialFields: boolean
	isActive: boolean
}

export interface ProjectIntakeCategoryRefWire {
	id: number
	code: string
	label: string
	description?: string
	isActive: boolean
}

export interface ProjectIntakeStatusRefWire {
	id: number
	code: string
	label: string
	description?: string
	isActive: boolean
}

export interface ProjectIntakeTrackingRefWire {
	id: number
	startDate: string | null
	plannedEndDate: string | null
	actualEndDate: string | null
	implementationDate: string | null
}

export interface ProjectIntakeRecordWire {
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
	commercialStatus?: string | null
	leaderTimesheetUserId?: number | null
	leaderName?: string | null
	observations?: string | null
	requiresTimesheetCreation: boolean
	timesheetRecordId?: number | null
	projectTrackingId?: number | null
	tracking?: ProjectIntakeTrackingRefWire | null
	isActive: boolean
	createdBy?: number | null
	updatedBy?: number | null
	createdAt?: string | null
	updatedAt?: string | null
	typeRef?: ProjectIntakeTypeRefWire | null
	categoryRef?: ProjectIntakeCategoryRefWire | null
	statusRef?: ProjectIntakeStatusRefWire | null
	timesheetProjectName?: string | null
}

export const mapTypeRef = (w: ProjectIntakeTypeRefWire): ProjectIntakeTypeRefDto => ({
	Id: w.id,
	Code: w.code,
	Label: w.label,
	Description: w.description,
	InternalLabel: w.internalLabel,
	SecondaryLabel: w.secondaryLabel,
	RegistrationLabel: w.registrationLabel,
	RequiresBusinessStatusDate: w.requiresBusinessStatusDate ?? false,
	RequiresActualEndDate: w.requiresActualEndDate ?? false,
	RequiresCommercialFields: w.requiresCommercialFields,
	IsActive: w.isActive,
})

export const mapCategoryRef = (w: ProjectIntakeCategoryRefWire): ProjectIntakeCategoryRefDto => ({
	Id: w.id,
	Code: w.code,
	Label: w.label,
	Description: w.description,
	IsActive: w.isActive,
})

export const mapStatusRef = (w: ProjectIntakeStatusRefWire): ProjectIntakeStatusRefDto => ({
	Id: w.id,
	Code: w.code,
	Label: w.label,
	Description: w.description,
	IsActive: w.isActive,
})

const mapTrackingRef = (w: ProjectIntakeTrackingRefWire): ProjectIntakeTrackingRef => ({
	id: w.id,
	startDate: w.startDate,
	plannedEndDate: w.plannedEndDate,
	actualEndDate: w.actualEndDate,
	implementationDate: w.implementationDate,
})

export const mapRecord = (w: ProjectIntakeRecordWire): ProjectIntakeRecordDto => ({
	Id: w.id,
	ProjectType: w.projectType ?? null,
	InternalProjectNumber: w.internalProjectNumber ?? null,
	SecondaryProjectNumber: w.secondaryProjectNumber ?? null,
	RegistrationDate: w.registrationDate ?? null,
	ClientId: w.clientId ?? null,
	ClientName: w.clientName ?? null,
	ProjectName: w.projectName ?? null,
	CategoryCode: w.categoryCode ?? null,
	ProjectStatusCode: w.projectStatusCode ?? null,
	CommercialStatus: w.commercialStatus ?? null,
	LeaderTimesheetUserId: w.leaderTimesheetUserId ?? null,
	LeaderName: w.leaderName ?? null,
	Observations: w.observations ?? null,
	RequiresTimesheetCreation: w.requiresTimesheetCreation,
	TimesheetRecordId: w.timesheetRecordId ?? null,
	ProjectTrackingId: w.projectTrackingId ?? null,
	Tracking: w.tracking ? mapTrackingRef(w.tracking) : null,
	IsActive: w.isActive,
	CreatedBy: w.createdBy ?? null,
	UpdatedBy: w.updatedBy ?? null,
	CreatedAt: w.createdAt ?? null,
	UpdatedAt: w.updatedAt ?? null,
	TypeRef: w.typeRef ? mapTypeRef(w.typeRef) : null,
	CategoryRef: w.categoryRef ? mapCategoryRef(w.categoryRef) : null,
	StatusRef: w.statusRef ? mapStatusRef(w.statusRef) : null,
	TimesheetProjectName: w.timesheetProjectName ?? null,
})
