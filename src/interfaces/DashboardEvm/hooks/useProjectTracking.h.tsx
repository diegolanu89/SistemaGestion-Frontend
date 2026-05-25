import { useCallback } from 'react'

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'

import { dashboardEvmAdapter } from '../services/DashboardEvmAdapter.s'
import { useDashboardEvmContext } from './useDashboardEvmContext.h'
import { DashboardEvmRowDto } from '../models/DashboardEvmDTO.m'

export const useProjectTracking = () => {
	const {
		selectedRow,
		setSelectedRow,
		tracking,
		setTracking,
		trackingLoading,
		setTrackingLoading,
		trackingError,
		setTrackingError,
	} = useDashboardEvmContext()

	const openTracking = useCallback(async (row: DashboardEvmRowDto) => {
		setSelectedRow(row)
		setTrackingLoading(true)
		setTrackingError(null)
		setTracking(null)

		try {
			logger.infoTag(LogTag.Adapter, '[DASHBOARD_EVM] Tracking fetch', { projectId: row.id })
			const data = await dashboardEvmAdapter.getTracking(row.id)
			setTracking(data)
		} catch (e) {
			logger.errorTag(LogTag.Adapter, '[DASHBOARD_EVM] Tracking error', e)
			setTrackingError('Error al cargar el seguimiento del proyecto')
		} finally {
			setTrackingLoading(false)
		}
	}, [])

	const closeTracking = useCallback(() => {
		setSelectedRow(null)
		setTracking(null)
		setTrackingError(null)
	}, [])

	return {
		selectedRow,
		tracking,
		trackingLoading,
		trackingError,
		openTracking,
		closeTracking,
	}
}
