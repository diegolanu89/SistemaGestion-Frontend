import { useCallback } from 'react'

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'

import { dashboardEvmService } from '../services/DashboardEvmBDT.s'
import { useDashboardEvmContext } from './useDashboardEvmContext.h'
import { DashboardEvmRowDto } from '../models/DashboardEvmDTO.m'

export const useProjectChanges = () => {
	const {
		selectedRow,
		setSelectedRow,
		setModalType,
		changeRequests,
		setChangeRequests,
		changeRequestsLoading,
		setChangeRequestsLoading,
		changeRequestsError,
		setChangeRequestsError,
	} = useDashboardEvmContext()

	const openChanges = useCallback(async (row: DashboardEvmRowDto) => {
		setSelectedRow(row)
		setModalType('changes')
		setChangeRequestsLoading(true)
		setChangeRequestsError(null)
		setChangeRequests(null)

		try {
			logger.infoTag(LogTag.Adapter, '[DASHBOARD_EVM] Change requests fetch', { projectId: row.id })
			const data = await dashboardEvmService.getChangeRequests(row.id)
			setChangeRequests(data)
		} catch (e) {
			logger.errorTag(LogTag.Adapter, '[DASHBOARD_EVM] Change requests error', e)
			setChangeRequestsError('Error al cargar los controles de cambio del proyecto')
		} finally {
			setChangeRequestsLoading(false)
		}
	}, [])

	const closeChanges = useCallback(() => {
		setSelectedRow(null)
		setModalType(null)
		setChangeRequests(null)
		setChangeRequestsError(null)
	}, [])

	return {
		selectedRow,
		changeRequests,
		changeRequestsLoading,
		changeRequestsError,
		openChanges,
		closeChanges,
	}
}
