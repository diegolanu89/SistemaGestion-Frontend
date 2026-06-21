import {
	ClockifySyncInterface,
	EstimateTimeEntriesResponseDto,
	GetClientsResponseDto,
	GetUsersResponseDto,
	SyncProjectTimeEntriesResponseDto,
	SyncResponseDto,
	SyncStatusResponseDto,
} from '../models/IClockifySync.m'

export class ClockifySyncMock implements ClockifySyncInterface {
	async syncClients(): Promise<SyncResponseDto> {
		return {
			message: 'Mock sync clients',
			count: 0,
		}
	}

	async getClients(): Promise<GetClientsResponseDto> {
		return {
			data: [],
			count: 0,
		}
	}

	async syncUsers(): Promise<SyncResponseDto> {
		return {
			message: 'Mock sync users',
			count: 0,
		}
	}

	async getUsers(): Promise<GetUsersResponseDto> {
		return {
			data: [],
			count: 0,
			only_active: false,
		}
	}

	async syncProjects(): Promise<SyncResponseDto> {
		return {
			message: 'Mock sync projects',
			count: 0,
		}
	}

	async syncTimeEntries(): Promise<SyncResponseDto> {
		return {
			message: 'Mock sync time entries',
			total: 0,
		}
	}

	async syncTimeEntriesAll(): Promise<SyncResponseDto> {
		return {
			message: 'Mock sync all time entries',
			total: 0,
		}
	}

	async syncTimeEntriesByProject(): Promise<SyncResponseDto> {
		return {
			message: 'Mock sync project time entries',
			total: 0,
		}
	}

	async estimateTimeEntries(): Promise<EstimateTimeEntriesResponseDto> {
		return {
			estimated_count: 0,
			estimated_time_seconds: 0,
			estimated_time_formatted: '~0 segundos',
			users_count: 0,
		}
	}

	async getSyncStatus(): Promise<SyncStatusResponseDto> {
		return {
			project_id: 0,
			clockify_project_id: null,
			time_entries_in_db: 0,
			time_entries_in_clockify: 0,
			needs_sync: false,
			missing_count: 0,
		}
	}

	async syncProjectTimeEntries(): Promise<SyncProjectTimeEntriesResponseDto> {
		return {
			message: 'Mock sync',
			project_id: 0,
			total_in_db_before: 0,
			total_in_db_after: 0,
			added: 0,
			updated: 0,
			skipped: 0,
			deleted: 0,
			params_used: {
				mode: 'all',
			},
		}
	}
}
