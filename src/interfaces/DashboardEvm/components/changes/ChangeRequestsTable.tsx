import { FC } from 'react'
import { ChangeRequestDto, ChangeRequestStatus } from '../../models/ChangeRequestDTO.m'

interface Props {
	changeRequests: ChangeRequestDto[]
}

const STATUS_LABEL: Record<ChangeRequestStatus, string> = {
	propuesto: 'Propuesto',
	aprobado: 'Aprobado',
	rechazado: 'Rechazado',
	implementado: 'Implementado',
}

const formatDate = (value: string | null): string => {
	if (!value) return '—'

	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return value

	return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
}

const formatHours = (value: number): string => value.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const ChangeRequestsTable: FC<Props> = ({ changeRequests }) => {
	if (changeRequests.length === 0) {
		return <div className="changes-modal__empty">El proyecto no tiene controles de cambio registrados.</div>
	}

	return (
		<table className="changes-modal__table">
			<thead>
				<tr>
					<th>Código</th>
					<th>Título</th>
					<th>Estado</th>
					<th>Fecha solicitud</th>
					<th className="changes-modal__th-numeric">Δ hs BAC</th>
				</tr>
			</thead>

			<tbody>
				{changeRequests.map((cr) => (
					<tr key={cr.id}>
						<td className="changes-modal__code">{cr.code}</td>
						<td>{cr.title}</td>
						<td>
							<span className={`changes-modal__status changes-modal__status--${cr.status}`}>{STATUS_LABEL[cr.status]}</span>
						</td>
						<td>{formatDate(cr.requestedDate)}</td>
						<td className="changes-modal__numeric">{formatHours(cr.bacHoursIncrement)}</td>
					</tr>
				))}
			</tbody>
		</table>
	)
}
