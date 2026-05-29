export interface VisibleProjectDto {
	id: number

	project_id: number

	project: {
		id: number

		name: string

		code: string | null

		status: string | null

		client: {
			name: string
		} | null

		client_name: string | null
	} | null
}

export interface UpdateVisibleProjectsDto {
	projectIds: number[]
}

export interface UpdateVisibleProjectsResponseDto {
	message: string

	project_ids: number[]
}
