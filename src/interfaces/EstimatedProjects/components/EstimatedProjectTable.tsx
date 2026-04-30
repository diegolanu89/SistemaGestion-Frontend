import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEstimatedProjectContext } from '../hooks/useEstimatedProjectContext.h'
import { ESTIMATED_PROJECT_CONFIG } from '../models/EstimatedProjectConfig.m'
import { buildEditPath } from '../routes/paths'
import { EstimatedProjectRow } from './EstimatedProjectRow'

export const EstimatedProjectTable: FC = () => {
	const { filtered, loading, refetch } = useEstimatedProjectContext()
	const navigate = useNavigate()

	const { TABLE, TEXTS } = ESTIMATED_PROJECT_CONFIG

	const handleEdit = (id: number) => {
		navigate(buildEditPath(id))
	}

	const handleDelete = (id: number) => {
		// 🔥 placeholder mock — solo log + refetch, sin delete real por ahora
		console.log('[ESTIMATED-PROYECT] delete request', id)
		void refetch()
	}

	if (loading) {
		return <div className="estimated-project-table__empty">{TEXTS.LOADING}</div>
	}

	return (
		<div className="estimated-project-table-wrapper">
			<table className="estimated-project-table">
				<thead>
					<tr>
						<th className="estimated-project-table__expand-header" />
						{TABLE.HEADERS.map((h) => (
							<th key={h}>{h.toUpperCase()}</th>
						))}
						<th className="estimated-project-table__actions-header">ACCIONES</th>
					</tr>
				</thead>

				<tbody>
					{filtered.map((p) => (
						<EstimatedProjectRow key={p.Id} project={p} onEdit={handleEdit} onDelete={handleDelete} />
					))}

					{filtered.length === 0 && (
						<tr>
							<td colSpan={TABLE.HEADERS.length + 2} className="estimated-project-table__empty">
								{TEXTS.EMPTY}
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	)
}
