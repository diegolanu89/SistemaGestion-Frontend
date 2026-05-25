import { FC } from 'react'
import { SectionLoader } from '../../../base/components/loading/SectionLoader'
import { DashboardEvmRowDto } from '../../models/DashboardEvmDTO.m'
import { ProjectTrackingDto } from '../../models/ProjectTrackingDTO.m'
import { TrackingDatesPanel } from './TrackingDatesPanel'
import { TrackingHistoryTable } from './TrackingHistoryTable'

interface Props {
	selectedRow: DashboardEvmRowDto | null
	tracking: ProjectTrackingDto | null
	loading: boolean
	error: string | null
	onClose: () => void
}

export const ProjectTrackingModal: FC<Props> = ({ selectedRow, tracking, loading, error, onClose }) => {
	const title = selectedRow
		? selectedRow.code
			? `${selectedRow.code} - ${selectedRow.name}`
			: selectedRow.name
		: 'Seguimiento del proyecto'

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

					{!loading && !error && tracking === null && (
						<div className="tracking-modal__history-empty">Este proyecto no tiene seguimiento registrado.</div>
					)}

					{!loading && !error && tracking && (
						<>
							<TrackingDatesPanel tracking={tracking} />

							<h3 className="tracking-modal__history-title">Historial de desvíos / cambios</h3>

							<TrackingHistoryTable updates={tracking.updates} />
						</>
					)}
				</section>
			</div>
		</div>
	)
}
