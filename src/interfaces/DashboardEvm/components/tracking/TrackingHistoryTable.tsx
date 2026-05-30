import { FC } from 'react'
import { ProjectTrackingUpdateDto } from '../../models/ProjectTrackingDTO.m'

interface Props {
	updates: ProjectTrackingUpdateDto[]
}

const formatDate = (value: string | null): string => {
	if (!value) return '—'

	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return value

	return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
}

const formatDateTime = (value: string | null): string => {
	if (!value) return '—'

	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return value

	return date.toLocaleString('es-AR', {
		day: '2-digit',
		month: '2-digit',
		year: '2-digit',
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
	})
}

export const TrackingHistoryTable: FC<Props> = ({ updates }) => {
	if (updates.length === 0) {
		return <div className="tracking-modal__empty">No hay registros en el historial.</div>
	}

	return (
		<table className="tracking-modal__history">
			<thead>
				<tr>
					<th>Fecha fin (c.c. / demoras)</th>
					<th>Observaciones</th>
					<th>Registrado</th>
				</tr>
			</thead>

			<tbody>
				{updates.map((entry) => (
					<tr key={entry.id}>
						<td>{formatDate(entry.changeEndDate)}</td>
						<td>{entry.observations ?? '—'}</td>
						<td>{formatDateTime(entry.createdAt)}</td>
					</tr>
				))}
			</tbody>
		</table>
	)
}
