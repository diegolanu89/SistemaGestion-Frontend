/* eslint-disable @typescript-eslint/no-unused-vars */
// services/DashBoardHourMock.s.ts

import {
	CreateDashboardFilterDto,
	CreateUserMonthlyCapacityDto,
	DashboardFilterDto,
	DashboardHoursFiltersDto,
	DashboardHoursResponseDto,
	DashboardSyncDto,
	UpdateDashboardFilterDto,
	UserMonthlyCapacityDto,
} from '../model/DashboardHoursDTO.m'

import { IDashboardHours } from '../model/IDashboardHours.m'

export class DashBoardHourMock implements IDashboardHours {
	async getDashboard(_filters?: DashboardHoursFiltersDto): Promise<DashboardHoursResponseDto> {
		return {
			success: true,

			months: ['2026-03', '2026-04', '2026-05'],

			month_hours: {
				'2026-03': 160,
				'2026-04': 168,
				'2026-05': 160,
			},

			options: {
				leaders: [
					{
						id: 1,
						name: 'Diego Peyrano',
					},
				],

				months: [
					{
						month_key: '2026-03',
						year: 2026,
						month: 3,
					},
					{
						month_key: '2026-04',
						year: 2026,
						month: 4,
					},
				],

				projects: [
					{
						id: '1',
						name: 'Sistema EVM',
						project_type: 'R',
					},
				],
			},

			kpis: {
				months: ['2026-03', '2026-04'],

				by_role: {
					DEV: {
						role: 'DEV',

						months: {
							'2026-03': {
								availability: 320,
								need: 280,
								difference: 40,
								difference_fte: 0.25,
							},
						},
					},
				},
			},

			data: [
				{
					user_id: 1,

					user_name: 'Diego Peyrano',

					leader_id: 1,

					leader_name: 'Diego Peyrano',

					role: 'Desarrollador',

					role_short: 'DEV',

					project_id: null,

					project_name: 'Varios (2)',

					project_type: null,

					client_name: 'Varios (2)',

					months: {
						'2026-03': {
							hours: 140,
							expected: 160,
						},

						'2026-04': {
							hours: 120,
							expected: 168,
						},
					},

					details: [
						{
							project_id: 1,

							project_name: 'Sistema EVM',

							project_type: 'R',

							client_name: 'BDT',

							months: {
								'2026-03': {
									hours: 80,
									expected: 80,
								},
							},
						},

						{
							project_id: 2,

							project_name: 'Dashboard Capacity',

							project_type: 'F',

							client_name: 'Interno',

							months: {
								'2026-03': {
									hours: 60,
									expected: 80,
								},
							},
						},
					],
				},
			],
		}
	}

	async getLastSync(): Promise<DashboardSyncDto> {
		return {
			last_date: '2026-05-20',
		}
	}

	async getFilters(): Promise<DashboardFilterDto[]> {
		return [
			{
				Id: 1,

				Name: 'Vista DEV',

				LeaderId: '1',

				MonthKeys: JSON.stringify(['2026-03', '2026-04']),

				ProjectId: '1',
			},
		]
	}

	async createFilter(data: CreateDashboardFilterDto): Promise<DashboardFilterDto> {
		return {
			Id: 999,

			Name: data.Name,

			LeaderId: data.LeaderId ?? null,

			MonthKeys: JSON.stringify(data.MonthKeys ?? []),

			ProjectId: data.ProjectId ?? null,
		}
	}

	async updateFilter(id: number, data: UpdateDashboardFilterDto): Promise<DashboardFilterDto> {
		return {
			Id: id,

			Name: data.Name ?? 'Filtro actualizado',

			LeaderId: data.LeaderId ?? null,

			MonthKeys: JSON.stringify(data.MonthKeys ?? []),

			ProjectId: data.ProjectId ?? null,
		}
	}

	async deleteFilter(_id: number): Promise<void> {}

	async getUserCapacities(userId: number): Promise<UserMonthlyCapacityDto[]> {
		return [
			{
				id: 1,

				userId,

				monthKey: '2026-03',

				monthLabel: 'Marzo 2026',

				hours: 160,

				createdAt: new Date().toISOString(),

				updatedAt: new Date().toISOString(),
			},
		]
	}

	async saveUserCapacities(userId: number, data: CreateUserMonthlyCapacityDto): Promise<UserMonthlyCapacityDto[]> {
		return data.Entries.map((entry, index) => ({
			id: index + 1,

			userId,

			monthKey: entry.MonthKey,

			monthLabel: entry.MonthKey,

			hours: entry.Hours,

			createdAt: new Date().toISOString(),

			updatedAt: new Date().toISOString(),
		}))
	}
}
