import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'

import { CapacityLimitsRequestDto, CapacityLimitsResponseDto } from '../../Capacity/model/CapacityDto.m'
import { capacityAdapter } from '../../Capacity/service/CapacityAdapter'

import { DashboardHoursResponseDto } from '../../DashboardHours/model/DashboardHoursDTO.m'
import { DashBoardHourAdapter } from '../../DashboardHours/services/DashBoardHourAdapter.s'

import { ExportCapacityDto } from '../../Etc/model/IEtcApi.m'
import { UserRefDto } from '../../Etc/model/UserRefDTO.m'

import { etcAdapter } from '../../Etc/service/EtcAdapter'
import { userAdapter } from '../../Etc/service/UserRefAdapter'

import { IDotationDataController } from '../models/IDotacionDataController.m'

import { ProjectMetricDto, BatchMetricsResponseDto } from '../models/MetricsDto.m'
import { DotationPreviewDto } from '../models/DotacionPreviewDTO.m'
import { UserMonthlyCapacityDto } from '../models/UserCapacityDTO.m'

import { projectMetricsAdapter } from '../services/MetricsAdapter.s'
import { userMonthlyCapacityAdapter } from '../services/UserCapacityAdapter.s'

import { DotationRowBuilder } from './DotacionRowBuilder.c'

export class DotationDataController implements IDotationDataController {
	async buildPreview(monthKeys: string[]): Promise<DotationPreviewDto> {
		logger.infoTag(LogTag.View, `[DOTATION_DATA] Building preview (${monthKeys.join(', ')})`)

		const dashboard = await this.getDashboardData(monthKeys)

		const users = await this.getUsers()

		const userIds = dashboard.data.map((row) => row.user_id).filter((id): id is number => id !== null && id !== undefined && id > 0)

		const userCapacities = await this.getUsersCapacities(userIds)

		const userNames = dashboard.data.map((row) => row.user_name).filter((name): name is string => Boolean(name))

		const capacityLimits = await this.getCapacityLimits({
			userNames,
			monthKeys,
		})

		const etcCapacities = await this.getEtcCapacities()

		const projectIds = Array.from(
			new Set(
				dashboard.data.flatMap((row) => row.details?.map((detail) => detail.project_id).filter((id): id is number => id !== null && id !== undefined) ?? [])
			)
		)

		const metrics = projectIds.length > 0 ? await this.getProjectsMetrics(projectIds) : null

		const rows = DotationRowBuilder.build({
			dashboard,
			users,
			userCapacities,
			capacityLimits,
			etcCapacities,
			metrics,
		})

		return {
			dashboard,

			users,

			userCapacities,

			capacityLimits,

			etcCapacities,

			metrics,

			rows,
		}
	}

	async getDashboardData(monthKeys: string[]): Promise<DashboardHoursResponseDto> {
		logger.infoTag(LogTag.View, `[DOTATION_DATA] Loading dashboard (${monthKeys.join(', ')})`)

		return await DashBoardHourAdapter.getDashboard({
			month_keys: monthKeys,
		})
	}

	async getUsers(): Promise<UserRefDto[]> {
		logger.infoTag(LogTag.View, '[DOTATION_DATA] Loading users')

		return await userAdapter.getUsers()
	}

	async getCapacityLimits(request: CapacityLimitsRequestDto): Promise<CapacityLimitsResponseDto> {
		logger.infoTag(LogTag.View, '[DOTATION_DATA] Loading capacity limits')

		return await capacityAdapter.getCapacityLimits(request)
	}

	async getUserCapacities(userId: number): Promise<UserMonthlyCapacityDto[]> {
		logger.infoTag(LogTag.View, `[DOTATION_DATA] Loading capacities for user ${userId}`)

		return await userMonthlyCapacityAdapter.getUserCapacities(userId)
	}

	async getUsersCapacities(userIds: number[]): Promise<Record<number, UserMonthlyCapacityDto[]>> {
		const validUserIds = userIds.filter((userId) => userId > 0)

		const entries = await Promise.all(
			validUserIds.map(async (userId) => {
				const capacities = await this.getUserCapacities(userId)

				return [userId, capacities] as const
			})
		)

		return Object.fromEntries(entries)
	}

	async getEtcCapacities(): Promise<ExportCapacityDto[]> {
		logger.infoTag(LogTag.View, '[DOTATION_DATA] Loading ETC capacities')

		return await etcAdapter.exportCapacities()
	}

	async getProjectMetrics(projectId: number): Promise<ProjectMetricDto> {
		logger.infoTag(LogTag.View, `[DOTATION_DATA] Loading project metrics (${projectId})`)

		return await projectMetricsAdapter.getProjectMetrics(projectId)
	}

	async getProjectsMetrics(projectIds: number[]): Promise<BatchMetricsResponseDto> {
		logger.infoTag(LogTag.View, `[DOTATION_DATA] Loading batch metrics (${projectIds.length} projects)`)

		return await projectMetricsAdapter.getBatchMetrics(projectIds)
	}
}

export const dotationDataController = new DotationDataController()
