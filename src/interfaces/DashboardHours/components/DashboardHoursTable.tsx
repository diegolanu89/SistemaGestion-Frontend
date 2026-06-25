import { FC } from 'react'

import { DashboardHoursEmpty } from './table/DashBoardHoursEmpty'
import { DashboardHoursHeader } from './table/DashboardHoursHeader'
import { DashboardHoursPagination } from './table/DashboardHoursPagination'
import { DashboardHoursDetailsTable } from './table/DashboardHoursDetailsTable'
import { DashboardHoursKpiTable } from './table/DashboardHoursKpiTable'

import { useDashboardHoursTable } from '../hooks/useDashboardHoursTable.h'
import { useDashboardTimeEntries } from '../hooks/useDashboardTimeEntries.h'

import { useDashboardHoursContext } from '../hooks/useEstimatedProjectContext.h'

export const DashboardHoursTable: FC = () => {
	const controller = useDashboardHoursTable()

	const { filters } = useDashboardHoursContext()

	// =====================================================
	// TIME ENTRIES MODE
	// =====================================================

	const timeEntriesEnabled = filters.source_type === 'TIME_ENTRIES'

	const { clockifyLoading, clockifyData } = useDashboardTimeEntries({
		rows: controller.rows,
		enabled: timeEntriesEnabled,
	})

	// =====================================================
	// EMPTY STATE
	// =====================================================

	if (!controller.rows.length) {
		return <DashboardHoursEmpty />
	}

	// =====================================================
	// RENDER
	// =====================================================

	return (
		<div className="dashboard-hours-table-card">
			<DashboardHoursHeader viewMode={controller.viewMode} onChangeViewMode={controller.setViewMode} totalUsers={controller.rows.length} />

			{controller.viewMode === 'details' ? (
				<DashboardHoursDetailsTable
					rows={controller.paginatedRows}
					months={controller.months}
					monthHours={controller.monthHours}
					expandedUsers={controller.expandedUsers}
					onToggleUser={controller.toggleUser}
					timeEntriesEnabled={timeEntriesEnabled}
					clockifyLoading={clockifyLoading}
					clockifyData={clockifyData}
				/>
			) : (
				<DashboardHoursKpiTable
					rows={controller.paginatedRows}
					months={controller.months}
					monthHours={controller.monthHours}
					timeEntriesEnabled={timeEntriesEnabled}
					clockifyLoading={clockifyLoading}
					clockifyData={clockifyData}
				/>
			)}

			<DashboardHoursPagination page={controller.page} totalPages={controller.totalPages} onPrev={controller.prevPage} onNext={controller.nextPage} />
		</div>
	)
}
