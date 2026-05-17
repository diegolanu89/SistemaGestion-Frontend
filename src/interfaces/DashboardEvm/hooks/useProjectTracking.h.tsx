import { useCallback } from 'react'

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'

import { dashboardEvmAdapter } from '../services/DashboardEvmAdapter.s'
import { useDashboardEvmContext } from './useDashboardEvmContext.h'

export const useProjectTracking = () => {
	const {
		tracking,
		setTracking,
		trackingLoading,
		setTrackingLoading,
		trackingError,
		setTrackingError,
	} = useDashboardEvmContext()

	const openTracking = useCallback(async (projectId: number) => {
		setTrackingLoading(true)
		setTrackingError(null)
		setTracking(null)

		try {
			logger.infoTag(LogTag.Adapter, '[DASHBOARD_EVM] Tracking fetch', { projectId })
			const data = await dashboardEvmAdapter.getTracking(projectId)
			setTracking(data)
		} catch (e) {
			logger.errorTag(LogTag.Adapter, '[DASHBOARD_EVM] Tracking error', e)
			setTrackingError('Error al cargar el seguimiento del proyecto')
		} finally {
			setTrackingLoading(false)
		}
	}, [])

	const closeTracking = useCallback(() => {
		setTracking(null)
		setTrackingError(null)
	}, [])

	return {
		tracking,
		trackingLoading,
		trackingError,
		openTracking,
		closeTracking,
	}
}
