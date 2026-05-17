import { FC } from 'react'
import { ProjectTrackingDto } from '../../models/ProjectTrackingDTO.m'

interface Props {
	tracking: ProjectTrackingDto
}

const formatDate = (value: string | null): string => {
	if (!value) return '—'

	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return value

	return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export const TrackingDatesPanel: FC<Props> = ({ tracking }) => (
	<div className="tracking-modal__dates">
		<div className="tracking-modal__date">
			<span className="tracking-modal__date-label">Fecha inicio</span>
			<strong>{formatDate(tracking.startDate)}</strong>
		</div>

		<div className="tracking-modal__date">
			<span className="tracking-modal__date-label">Fecha fin planificada</span>
			<strong>{formatDate(tracking.endDatePlanned)}</strong>
		</div>

		<div className="tracking-modal__date">
			<span className="tracking-modal__date-label">Fecha fin real</span>
			<strong>{formatDate(tracking.endDateActual)}</strong>
		</div>

		<div className="tracking-modal__date">
			<span className="tracking-modal__date-label">Fecha de implementación</span>
			<strong>{formatDate(tracking.implementationDate)}</strong>
		</div>
	</div>
)
