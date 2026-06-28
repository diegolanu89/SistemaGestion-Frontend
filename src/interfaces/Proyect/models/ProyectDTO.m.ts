export interface ProjectIntakeTypeRefDto {
	Id: number
	Code: string
	Label: string
	Description?: string

	InternalLabel: string
	SecondaryLabel: string
	RegistrationLabel: string

	RequiresBusinessStatusDate: boolean
	RequiresActualEndDate: boolean
	RequiresCommercialFields: boolean

	IsActive: boolean
}

export interface ProjectIntakeCategoryRefDto {
	Id: number
	Code: string
	Label: string
	Description?: string
	IsActive: boolean
}

export interface ProjectIntakeStatusRefDto {
	Id: number
	Code: string
	Label: string
	Description?: string
	IsActive: boolean
}

// ==========================
// 🔹 MAIN DTO
// ==========================

export interface ProjectIntakeClientRefDto {
	Id: number
	Name: string
	ExternalId?: string | null
}

export interface ProjectIntakeLeaderRefDto {
	Id: number
	Name: string
	Email: string
}

export interface ProjectIntakeTrackingRef {
	id: number
	startDate: string | null
	plannedEndDate: string | null
	actualEndDate: string | null
	implementationDate: string | null
}

export interface ProjectIntakeRecordDto {
	Id: number

	ProjectType?: string | null
	InternalProjectNumber?: string | null
	SecondaryProjectNumber?: string | null

	RegistrationDate?: string | null
	ClientId?: number | null
	ClientName?: string | null

	ProjectName?: string | null
	CategoryCode?: string | null
	ProjectStatusCode?: string | null

	CommercialStatus?: string | null
	LeaderTimesheetUserId?: number | null
	LeaderName?: string | null
	Observations?: string | null

	RequiresTimesheetCreation: boolean
	TimesheetRecordId?: number | null

	ProjectTrackingId?: number | null
	Tracking?: ProjectIntakeTrackingRef | null

	IsActive: boolean

	CreatedBy?: number | null
	UpdatedBy?: number | null

	CreatedAt?: string | null
	UpdatedAt?: string | null

	TypeRef?: ProjectIntakeTypeRefDto | null
	CategoryRef?: ProjectIntakeCategoryRefDto | null
	StatusRef?: ProjectIntakeStatusRefDto | null

	TimesheetProjectName?: string | null
}

// ==========================
// 🔹 REQUEST DTOs
// ==========================

export interface CreateProjectIntakeDto {
	ProjectType: string
	SecondaryProjectNumber?: string
	RegistrationDate?: string

	ClientId?: number

	ProjectName: string
	CategoryCode?: string
	ProjectStatusCode?: string

	StartDate?: string
	PlannedEndDate?: string
	ActualEndDate?: string
	ImplementationDate?: string

	CommercialStatus?: string
	LeaderTimesheetUserId?: number
	Observations?: string

	RequiresTimesheetCreation?: boolean
}

export interface UpdateProjectIntakeDto {
	SecondaryProjectNumber?: string
	RegistrationDate?: string

	ClientId?: number

	ProjectName?: string
	CategoryCode?: string
	ProjectStatusCode?: string

	StartDate?: string
	PlannedEndDate?: string
	ActualEndDate?: string
	ImplementationDate?: string

	CommercialStatus?: string
	LeaderTimesheetUserId?: number
	Observations?: string

	RequiresTimesheetCreation?: boolean
}

export interface PaginatedProjectIntakeResponseDto {
	data: ProjectIntakeRecordDto[]

	currentPage: number

	perPage: number

	total: number

	lastPage: number
}
