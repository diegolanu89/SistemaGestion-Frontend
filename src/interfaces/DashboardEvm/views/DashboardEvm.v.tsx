import { FC } from 'react'

import { SectionLoader } from '../../base/components/loading/SectionLoader'

import { useDashboardEvmContext } from '../hooks/useDashboardEvmContext.h'
import { useDashboardEvmController } from '../hooks/useDashboardEvmController.h'
import { useProjectChanges } from '../hooks/useProjectChanges.h'
import { useProjectTracking } from '../hooks/useProjectTracking.h'

import { DashboardEvmHeader } from '../components/DashboardEvmHeader'
import { DashboardEvmSummaryCards } from '../components/DashboardEvmSummaryCards'
import { DashboardEvmFiltersBar } from '../components/DashboardEvmFilters'
import { DashboardEvmTable } from '../components/DashboardEvmTable'
import { DashboardEvmPagination } from '../components/DashboardEvmPagination'
import { ProjectChangesModal } from '../components/changes/ProjectChangesModal'
import { ProjectTrackingModal } from '../components/tracking/ProjectTrackingModal'

export const DashboardEvmView: FC = () => {
	const { loading, error, groups, summary, refetch, page, setPage, totalPages } = useDashboardEvmController()
	const { modalType } = useDashboardEvmContext()

	const { selectedRow: changesRow, changeRequests, changeRequestsLoading, changeRequestsError, openChanges, closeChanges } = useProjectChanges()
	const { selectedRow: trackingRow, tracking, trackingLoading, trackingError, openTracking, closeTracking } = useProjectTracking()

	return (
		<div className="dashboard-evm">
			<DashboardEvmHeader onRefresh={refetch} disabled={loading} />

			<DashboardEvmSummaryCards summary={summary} />

			<DashboardEvmFiltersBar />

			<div className="dashboard-evm__table-wrapper">
				{loading && <SectionLoader text="Cargando dashboard..." />}

				{!loading && error && <div className="dashboard-evm__error">{error}</div>}

				{!loading && !error && <DashboardEvmTable groups={groups} onOpenChanges={openChanges} onOpenTracking={openTracking} />}

				{!loading && !error && <DashboardEvmPagination page={page} setPage={setPage} totalPages={totalPages} />}
			</div>

			{modalType === 'changes' && (
				<ProjectChangesModal
					selectedRow={changesRow}
					changeRequests={changeRequests}
					loading={changeRequestsLoading}
					error={changeRequestsError}
					onClose={closeChanges}
				/>
			)}

			{modalType === 'tracking' && (
				<ProjectTrackingModal
					selectedRow={trackingRow}
					tracking={tracking}
					loading={trackingLoading}
					error={trackingError}
					onClose={closeTracking}
				/>
			)}
		</div>
	)
}

export default DashboardEvmView
