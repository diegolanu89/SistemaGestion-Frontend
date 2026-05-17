import { FC } from 'react'

import { SectionLoader } from '../../base/components/loading/SectionLoader'

import { useDashboardEvmController } from '../hooks/useDashboardEvmController.h'
import { useProjectTracking } from '../hooks/useProjectTracking.h'

import { DashboardEvmHeader } from '../components/DashboardEvmHeader'
import { DashboardEvmSummaryCards } from '../components/DashboardEvmSummaryCards'
import { DashboardEvmFiltersBar } from '../components/DashboardEvmFilters'
import { DashboardEvmTable } from '../components/DashboardEvmTable'
import { ProjectTrackingModal } from '../components/tracking/ProjectTrackingModal'

export const DashboardEvmView: FC = () => {
	const { loading, error, filters, setFilters, groups, summary, refetch } = useDashboardEvmController()
	const { tracking, trackingLoading, trackingError, openTracking, closeTracking } = useProjectTracking()

	const showTracking = tracking !== null || trackingLoading || trackingError !== null

	return (
		<div className="dashboard-evm">
			<DashboardEvmHeader onRefresh={refetch} disabled={loading} />

			<DashboardEvmSummaryCards summary={summary} />

			<DashboardEvmFiltersBar filters={filters} onChange={setFilters} />

			<div className="dashboard-evm__table-wrapper">
				{loading && <SectionLoader text="Cargando dashboard..." />}

				{!loading && error && <div className="dashboard-evm__error">{error}</div>}

				{!loading && !error && <DashboardEvmTable groups={groups} onOpenTracking={openTracking} />}
			</div>

			{showTracking && (
				<ProjectTrackingModal tracking={tracking} loading={trackingLoading} error={trackingError} onClose={closeTracking} />
			)}
		</div>
	)
}

export default DashboardEvmView
