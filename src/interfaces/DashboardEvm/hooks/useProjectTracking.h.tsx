import { useCallback } from 'react'

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'

import { dashboardEvmService } from '../services/DashboardEvmBDT.s'
import { useDashboardEvmContext } from './useDashboardEvmContext.h'
import { DashboardEvmRowDto } from '../models/DashboardEvmDTO.m'

export const useProjectTracking = () => {
	const {
		selectedRow,
		setSelectedRow,
		setModalType,
		tracking,
		setTracking,
		trackingLoading,
		setTrackingLoading,
		trackingError,
		setTrackingError,
	} = useDashboardEvmContext()

	const openTracking = useCallback(async (row: DashboardEvmRowDto) => {
		setSelectedRow(row)
		setModalType('tracking')
		setTrackingLoading(true)
		setTrackingError(null)
		setTracking(null)

		// Si el row dice que no hay tracking, no llamamos al back: dejamos null
		// y el modal va a mostrar los placeholders con "—".
		if (!row.hasTracking) {
			setTrackingLoading(false)
			return
		}

		try {
			logger.infoTag(LogTag.Adapter, '[DASHBOARD_EVM] Tracking fetch', { projectId: row.id })
			const data = await dashboardEvmService.getTracking(row.id)
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
		setModalType(null)
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
