import { FC } from 'react'
import { SectionLoader } from '../../../base/components/loading/SectionLoader'
import { ProjectTrackingDto } from '../../models/ProjectTrackingDTO.m'
import { TrackingDatesPanel } from './TrackingDatesPanel'
import { TrackingHistoryTable } from './TrackingHistoryTable'

interface Props {
	tracking: ProjectTrackingDto | null
	loading: boolean
	error: string | null
	onClose: () => void
}

export const ProjectTrackingModal: FC<Props> = ({ tracking, loading, error, onClose }) => {
	const title = tracking ? (tracking.projectCode ? `${tracking.projectCode} - ${tracking.projectName}` : tracking.projectName) : 'Seguimiento del proyecto'

	return (
		<div className="modal-overlay" role="dialog" aria-modal="true">
			<div className="modal tracking-modal">
				<header className="modal__header">
					<h2>{title}</h2>
					<button type="button" onClick={onClose} aria-label="Cerrar">
						✕
					</button>
				</header>

				<section className="modal__body">
					{loading && <SectionLoader text="Cargando seguimiento..." />}

					{!loading && error && <div className="tracking-modal__error">{error}</div>}

					{!loading && !error && tracking && (
						<>
							<TrackingDatesPanel tracking={tracking} />

							<h3 className="tracking-modal__history-title">Historial de desvíos / cambios</h3>

							<TrackingHistoryTable history={tracking.history} />
						</>
					)}
				</section>
			</div>
		</div>
	)
}
