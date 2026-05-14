// views/EtcLoadView.tsx

import { FC } from 'react'
import { useEtcController } from '../hooks/useEtcController.h'
import { EtcToolbar } from '../components/EtcToolBar'
import { EtcSummary } from '../components/EtcSummary'
import { SectionLoader } from '../../base/components/loading/SectionLoader'
import { useEtcContext } from '../hooks/useEtcContext.h'
import { EtcHeader } from '../components/EtcHeader'

export const EtcLoadView: FC = () => {
	useEtcController()

	const { loading } = useEtcContext()

	return (
		<div className="etc-container">
			<EtcHeader />

			<EtcToolbar />

			<EtcSummary />

			{loading && <SectionLoader text="Procesando ETC..." />}
		</div>
	)
}
export default EtcLoadView
