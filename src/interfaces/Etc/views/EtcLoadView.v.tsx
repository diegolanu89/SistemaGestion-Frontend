// views/EtcLoadView.tsx

import { FC, useEffect } from 'react'
import { useEtcController } from '../hooks/useEtcController.h'
import { EtcToolbar } from '../components/EtcToolBar'
import { EtcGrid } from '../components/EtcGrid'
import { EtcSummary } from '../components/EtcSummary'
import { SectionLoader } from '../../base/components/loading/SectionLoader'
import { useEtcContext } from '../hooks/useEtcContext.h'
import { EtcHeader } from '../components/EtcHeader'

export const EtcLoadView: FC = () => {
	useEtcController()

	const { loading } = useEtcContext()

	useEffect(() => {
		console.log('HOLA')
	}, [])

	return (
		<div className="etc-container">
			<EtcHeader />

			<EtcToolbar />

			<EtcSummary />

			<EtcGrid />

			{loading && <SectionLoader text="Procesando ETC..." />}
		</div>
	)
}
export default EtcLoadView
