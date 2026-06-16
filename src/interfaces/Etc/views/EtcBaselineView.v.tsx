// views/EtcBaselineView.tsx

import { FC, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { useEtcContext } from '../hooks/useEtcContext.h'
import { ETC_LOAD_PROJECT } from '../routes/paths'

import { EtcWeeklyVersionMetrics } from '../components/EtcWeeklyVersionMetrics'
import { EtcWeeklyVersionMonthSelector } from '../components/EtcWeeklyVersionMonthSelector'
import { EtcWeeklyVersionResources } from '../components/EtcWeeklyVersionResources'
import { EtcWeeklyVersionGrid } from '../components/EtcWeeklyVersionGrid'
import { EtcWeeklyVersionHeader } from '../components/EtcWeeklyVersionHeader'
import { EtcBaselineActions } from '../components/EtcBaselineActions'

import { useEtcWeeklyVersionController } from '../hooks/useEtcWeelyVersionController.h'

import { SectionLoader } from '../../base/components/loading/SectionLoader'

export const EtcBaselineView: FC = () => {
	const navigate = useNavigate()
	const { projectId } = useEtcContext()
	const { loading } = useEtcWeeklyVersionController()

	useEffect(() => {
		if (!projectId) {
			navigate(ETC_LOAD_PROJECT.ETC_LOAD, { replace: true })
		}
	}, [projectId, navigate])

	return (
		<div className="etc-weekly-version">
			<EtcWeeklyVersionHeader title="Nueva línea base" />

			<EtcWeeklyVersionMetrics />

			<EtcWeeklyVersionMonthSelector />

			<EtcWeeklyVersionResources />

			<EtcWeeklyVersionGrid />

			<EtcBaselineActions />

			{loading && (
				<div className="etc-weekly-version__loading">
					<SectionLoader text="Grabando línea base..." />
				</div>
			)}

			<Outlet />
		</div>
	)
}

export default EtcBaselineView
