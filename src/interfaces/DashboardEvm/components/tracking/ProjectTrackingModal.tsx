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
	const subtitle = selectedRow ? (selectedRow.code ? `${selectedRow.code} - ${selectedRow.name}` : selectedRow.name) : null

	return (
		<div className="modal-overlay" role="dialog" aria-modal="true">
			<div className="modal tracking-modal">
				<header className="modal__header">
					<div className="tracking-modal__title">
						<h2>Seguimiento: planificación y fechas</h2>
						{subtitle && <span className="tracking-modal__subtitle">{subtitle}</span>}
					</div>
					<button type="button" onClick={onClose} aria-label="Cerrar">
						✕
					</button>
				</header>

				<section className="modal__body">
					{loading && <SectionLoader text="Cargando seguimiento..." />}

					{!loading && error && <div className="tracking-modal__error">{error}</div>}

					{!loading && !error && (
						<>
							<TrackingDatesPanel tracking={tracking} />

							<TrackingHistoryTable updates={tracking?.updates ?? []} />
						</>
					)}
				</section>
			</div>
		</div>
	)
}
