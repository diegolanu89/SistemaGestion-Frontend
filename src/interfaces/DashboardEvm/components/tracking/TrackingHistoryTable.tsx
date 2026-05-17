import { FC } from 'react'
import { TrackingHistoryEntry } from '../../models/ProjectTrackingDTO.m'

interface Props {
	history: TrackingHistoryEntry[]
}

const formatDate = (value: string | null): string => {
	if (!value) return '—'

	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return value

	return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const formatDateTime = (value: string | null): string => {
	if (!value) return '—'

	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return value

	return date.toLocaleString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export const TrackingHistoryTable: FC<Props> = ({ history }) => {
	if (history.length === 0) {
		return <div className="tracking-modal__history-empty">El proyecto no tiene registros en el historial de cambios.</div>
	}

	return (
		<table className="tracking-modal__history">
			<thead>
				<tr>
					<th>Fecha fin</th>
					<th>Observaciones</th>
					<th>Registrado</th>
				</tr>
			</thead>

			<tbody>
				{history.map((entry) => (
					<tr key={entry.id}>
						<td>{formatDate(entry.endDate)}</td>
						<td>{entry.observations}</td>
						<td>{formatDateTime(entry.registeredAt)}</td>
					</tr>
				))}
			</tbody>
		</table>
	)
}
