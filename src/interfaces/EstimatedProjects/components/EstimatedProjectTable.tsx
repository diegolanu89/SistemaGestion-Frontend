import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEstimatedProjectContext } from '../hooks/useEstimatedProjectContext.h'
import { ESTIMATED_PROJECT_CONFIG } from '../models/EstimatedProjectConfig.m'
import { buildEditPath } from '../routes/paths'
import { EstimatedProjectRow } from './EstimatedProjectRow'
import { estimatedProjectAdapter } from '../services/EstimatedProjectAdapter.s'

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'

export const EstimatedProjectTable: FC = () => {
	const { filtered, loading, refetch } = useEstimatedProjectContext()
	const navigate = useNavigate()

	const { TABLE, TEXTS } = ESTIMATED_PROJECT_CONFIG

	const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null)
	const [deleting, setDeleting] = useState<boolean>(false)
	const [deleteError, setDeleteError] = useState<string | null>(null)

	const pendingProject = pendingDeleteId !== null ? filtered.find((p) => p.Id === pendingDeleteId) ?? null : null

	const handleEdit = (id: number) => {
		navigate(buildEditPath(id))
	}

	const requestDelete = (id: number) => {
		setPendingDeleteId(id)
		setDeleteError(null)
	}

	const cancelDelete = () => {
		if (deleting) return
		setPendingDeleteId(null)
		setDeleteError(null)
	}

	const confirmDelete = async () => {
		if (pendingDeleteId === null) return
		setDeleting(true)
		setDeleteError(null)
		try {
			await estimatedProjectAdapter.delete(pendingDeleteId)
			await refetch()
			setPendingDeleteId(null)
		} catch (error: unknown) {
			const err = error instanceof Error ? error : new Error('Unknown error deleting estimated project')
			logger.errorTag(LogTag.Adapter, err)
			setDeleteError(err.message)
		} finally {
			setDeleting(false)
		}
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
						<EstimatedProjectRow key={p.Id} project={p} onEdit={handleEdit} onDelete={requestDelete} />
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

			{pendingProject && (
				<div className="estimated-project-table__confirm-overlay" role="dialog" aria-modal="true">
					<div className="estimated-project-table__confirm">
						<h3>Borrar proyecto estimado</h3>
						<p>
							Esta acción es <strong>irreversible</strong>: el proyecto <strong>{pendingProject.Name}</strong>
							{pendingProject.ClientName ? ` (${pendingProject.ClientName})` : ''} y todas sus asignaciones se eliminarán definitivamente
							de la base.
						</p>
						{deleteError && <p className="estimated-project-table__confirm-error">{deleteError}</p>}
						<div className="estimated-project-table__confirm-actions">
							<button type="button" className="estimated-project-form__btn estimated-project-form__btn--cancel" onClick={cancelDelete} disabled={deleting}>
								Cancelar
							</button>
							<button
								type="button"
								className="estimated-project-table__action estimated-project-table__action--delete"
								onClick={confirmDelete}
								disabled={deleting}
							>
								{deleting ? 'Eliminando…' : 'Borrar definitivamente'}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
