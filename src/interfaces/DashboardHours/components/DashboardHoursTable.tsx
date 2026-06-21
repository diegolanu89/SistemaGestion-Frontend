import { FC } from 'react'
import { DashboardHoursEmpty } from './table/DashBoardHoursEmpty'
import { DashboardHoursHeader } from './table/DashboardHoursHeader'
import { DashboardHoursPagination } from './table/DashboardHoursPagination'
import { useDashboardHoursTable } from '../hooks/useDashboardHoursTable.h'
import { DashboardHoursDetailsTable } from './table/DashboardHoursDetailsTable'
import { DashboardHoursKpiTable } from './table/DashboardHoursKpiTable'

export const DashboardHoursTable: FC = () => {
	const controller = useDashboardHoursTable()

	if (!controller.rows.length) {
		return <DashboardHoursEmpty />
	}

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
				/>
			) : (
				<DashboardHoursKpiTable rows={controller.paginatedRows} months={controller.months} monthHours={controller.monthHours} />
			)}

			<DashboardHoursPagination page={controller.page} totalPages={controller.totalPages} onPrev={controller.prevPage} onNext={controller.nextPage} />
		</div>
	)
}
