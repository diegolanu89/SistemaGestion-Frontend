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

	BusinessStatusDate?: string | null
	EstimatedEndDate?: string | null
	ActualEndDate?: string | null

	CommercialStatus?: string | null
	LeaderName?: string | null
	Observations?: string | null

	RequiresClockifyCreation: boolean
	ClockifyRecordId?: number | null

	IsActive: boolean

	CreatedBy?: number | null
	UpdatedBy?: number | null

	CreatedAt?: string | null
	UpdatedAt?: string | null

	// 🔥 EXPANDIDOS
	TypeRef?: ProjectIntakeTypeRefDto | null
	CategoryRef?: ProjectIntakeCategoryRefDto | null
	StatusRef?: ProjectIntakeStatusRefDto | null

	ClockifyProjectName?: string | null
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

	BusinessStatusDate?: string
	EstimatedEndDate?: string
	ActualEndDate?: string

	CommercialStatus?: string
	LeaderName?: string
	Observations?: string

	RequiresClockifyCreation?: boolean
}

export interface UpdateProjectIntakeDto {
	SecondaryProjectNumber?: string
	RegistrationDate?: string

	ClientId?: number

	ProjectName?: string
	CategoryCode?: string
	ProjectStatusCode?: string

	BusinessStatusDate?: string
	EstimatedEndDate?: string
	ActualEndDate?: string

	CommercialStatus?: string
	LeaderName?: string
	Observations?: string
}
