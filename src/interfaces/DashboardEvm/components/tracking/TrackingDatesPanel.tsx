import { FC } from 'react'
import { ProjectTrackingDto } from '../../models/ProjectTrackingDTO.m'
import { formatDate } from '../../../base/utils/dateFormat'

interface Props {
	tracking: ProjectTrackingDto | null
}

export const TrackingDatesPanel: FC<Props> = ({ tracking }) => (
	<dl className="tracking-modal__dates">
		<div className="tracking-modal__date-row">
			<dt>Fecha inicio</dt>
			<dd>{formatDate(tracking?.startDate)}</dd>
		</div>

		<div className="tracking-modal__date-row">
			<dt>Fecha fin planificada</dt>
			<dd>{formatDate(tracking?.plannedEndDate)}</dd>
		</div>

		<div className="tracking-modal__date-row">
			<dt>Fecha fin real</dt>
			<dd>{formatDate(tracking?.actualEndDate)}</dd>
		</div>

		<div className="tracking-modal__date-row">
			<dt>Fecha de implementación</dt>
			<dd>{formatDate(tracking?.implementationDate)}</dd>
		</div>
	</dl>
)
