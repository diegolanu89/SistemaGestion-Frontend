import { FC, useMemo, useState } from 'react'
import { EstimatedProjectRecordDto } from '../models/EstimatedProjectDTO.m'
import { ESTIMATED_PROJECT_CONFIG } from '../models/EstimatedProjectConfig.m'
import { computeSummary } from '../utils/summary'

interface Props {
	project: EstimatedProjectRecordDto
	onEdit: (id: number) => void
	onDelete: (id: number) => void
}

export const EstimatedProjectRow: FC<Props> = ({ project, onEdit, onDelete }) => {
	const [expanded, setExpanded] = useState(false)

	const { TABLE, ICONS } = ESTIMATED_PROJECT_CONFIG

	const summary = useMemo(() => computeSummary(project), [project])

	const months = useMemo(() => {
		const set = new Set<string>()
		project.Resources.forEach((r) => Object.keys(r.MonthlyHours).forEach((m) => set.add(m)))
		return [...set].sort()
	}, [project])

	return (
		<>
			<tr className="estimated-project-table__row">
				<td className="estimated-project-table__expand-cell">
					<button
						type="button"
						className={`estimated-project-table__expand ${expanded ? 'is-open' : ''}`}
						onClick={() => setExpanded((v) => !v)}
						aria-label={expanded ? 'Contraer' : 'Expandir'}
					>
						<span className="material-icons">{expanded ? ICONS.COLLAPSE : ICONS.EXPAND}</span>
					</button>
				</td>

				<td>{project.ClientName ?? '-'}</td>
				<td>{project.Name}</td>
				<td>{project.Code ?? '-'}</td>
				<td>{summary.totalHours.toFixed(1)}</td>
				<td>{summary.totalResources}</td>
				<td>{summary.totalMonths}</td>

				<td className="estimated-project-table__actions">
					<button
						type="button"
						className="estimated-project-table__action estimated-project-table__action--edit"
						onClick={() => onEdit(project.Id)}
						data-tooltip={TABLE.ACTIONS.EDIT_TOOLTIP}
					>
						{TABLE.ACTIONS.EDIT_LABEL}
					</button>
					<button
						type="button"
						className="estimated-project-table__action estimated-project-table__action--delete"
						onClick={() => onDelete(project.Id)}
						data-tooltip={TABLE.ACTIONS.DELETE_TOOLTIP}
					>
						{TABLE.ACTIONS.DELETE_LABEL}
					</button>
				</td>
			</tr>

			{expanded && (
				<tr className="estimated-project-table__detail-row">
					<td colSpan={8}>
						<div className="estimated-project-detail">
							<header className="estimated-project-detail__header">
								<span className="material-icons">groups</span>
								<h4>Distribución por recurso y mes</h4>
							</header>

							{project.Resources.length === 0 ? (
								<p className="estimated-project-detail__empty">Sin recursos asignados.</p>
							) : (
								<table className="estimated-project-detail__table">
									<thead>
										<tr>
											<th>Recurso</th>
											{months.map((m) => (
												<th key={m}>{m}</th>
											))}
											<th>Total</th>
										</tr>
									</thead>
									<tbody>
										{project.Resources.map((res) => {
											const total = Object.values(res.MonthlyHours).reduce((a, b) => a + b, 0)
											return (
												<tr key={res.UserId}>
													<td>{res.UserName}</td>
													{months.map((m) => (
														<td key={m}>{res.MonthlyHours[m] ?? '-'}</td>
													))}
													<td>
														<strong>{total.toFixed(1)}</strong>
													</td>
												</tr>
											)
										})}
									</tbody>
								</table>
							)}
						</div>
					</td>
				</tr>
			)}
		</>
	)
}
