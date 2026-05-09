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

import { SectionLoader } from '../../base/components/loading/SectionLoader'

export const EtcWeeklyVersionView: FC = () => {
	const { loading } = useEtcWeeklyVersionController()

	return (
		<div className="etc-weekly-version">
			<EtcWeeklyVersionHeader />

			<EtcWeeklyVersionMetrics />

			<EtcWeeklyVersionMonthSelector />

			<EtcWeeklyVersionResources />

			<EtcWeeklyVersionGrid />

			<EtcWeeklyVersionActions />

			{loading && (
				<div className="etc-weekly-version__loading">
					<SectionLoader text="Guardando versión semanal..." />
				</div>
			)}

			<Outlet />
		</div>
	)
}

export default EtcWeeklyVersionView
