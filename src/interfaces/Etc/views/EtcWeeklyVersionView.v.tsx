// views/EtcWeeklyVersionView.tsx

import { FC } from 'react'
import { Outlet } from 'react-router-dom'

import { EtcWeeklyVersionMetrics } from '../components/EtcWeeklyVersionMetrics'
import { EtcWeeklyVersionMonthSelector } from '../components/EtcWeeklyVersionMonthSelector'
import { EtcWeeklyVersionResources } from '../components/EtcWeeklyVersionResources'
import { EtcWeeklyVersionGrid } from '../components/EtcWeeklyVersionGrid'
import { EtcWeeklyVersionHeader } from '../components/EtcWeeklyVersionHEader'
import { EtcWeeklyVersionActions } from '../components/EtcWeeklyVersionActions'

import { useEtcWeeklyVersionController } from '../hooks/useEtcWeelyVersionController.h'

export const EtcWeeklyVersionView: FC = () => {
	const controller = useEtcWeeklyVersionController()

	return (
		<div className="etc-weekly-version">
			<EtcWeeklyVersionHeader projectName={controller.projectName} onBack={controller.handleBack} />

			<EtcWeeklyVersionMetrics bac={controller.bac} erc={controller.erc} usePercentage={controller.usePercentage} />

			<EtcWeeklyVersionMonthSelector
				months={controller.selectedMonths}
				onAddMonth={controller.addMonth}
				onRemoveMonth={controller.removeMonth}
				rangeLabel={controller.rangeLabel}
			/>

			<EtcWeeklyVersionResources
				users={controller.filteredUsers}
				selectedUserIds={controller.selectedUserIds}
				search={controller.search}
				onSearch={controller.setSearch}
				onToggleUser={controller.toggleUser}
			/>

			<EtcWeeklyVersionGrid users={controller.selectedUsers} months={controller.selectedMonths} values={controller.values} onChange={controller.updateHours} />

			<EtcWeeklyVersionActions onCancel={controller.handleBack} onSave={controller.saveSnapshot} loading={controller.loading} />

			<Outlet />
		</div>
	)
}

export default EtcWeeklyVersionView
