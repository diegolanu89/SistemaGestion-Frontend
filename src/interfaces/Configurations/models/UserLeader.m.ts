export interface UserLeaderDto {
	id?: number
	userId: number
	leaderId: number
	startDate: string
	endDate?: string | null
	notes?: string | null
	user?: { id: number; name: string; email: string }
	leader?: { id: number; name: string; email: string }
	createdAt?: string
	updatedAt?: string
}

export interface UserLeaderListResponse {
	success: boolean
	data: {
		data: UserLeaderDto[]
		current_page: number
		per_page: number
		total: number
		last_page: number
	}
}

export interface UserLeaderOptionsResponse {
	success: boolean
	data: {
		users: Array<{ id: number; name: string; email: string }>
	}
}

export interface CreateUserLeaderDto {
	userId: number
	leaderId: number
	startDate?: string
	endDate?: string | null
	notes?: string | null
}

export interface UpdateUserLeaderDto {
	leaderId?: number
	endDate?: string | null
	notes?: string | null
}

export interface BulkUserLeaderDto {
	userIds: number[]
	leaderId: number
	startDate?: string
}
