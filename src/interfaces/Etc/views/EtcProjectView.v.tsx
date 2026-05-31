import { FC } from 'react'
import { EtcHeader } from '../components/EtcHeader'
import { EtcSummary } from '../components/EtcSummary'

import { SectionLoader } from '../../base/components/loading/SectionLoader'
import { useEtcContext } from '../hooks/useEtcContext.h'
import { useEtcProjectController } from '../hooks/useEtcProjectController.h'
import EtcProjectToolbar from '../components/EtcProjectToolbar'

export const EtcLoadProjectView: FC = () => {
	useEtcProjectController()

	const { loading, projectId } = useEtcContext()

	return (
		<div className="etc-container">
			<EtcHeader />

			<EtcProjectToolbar />

			{projectId > 0 && (
				<>
					<EtcSummary />
				</>
			)}

			{loading && <SectionLoader text="Cargando proyecto..." />}
		</div>
	)
}

export default EtcLoadProjectView
