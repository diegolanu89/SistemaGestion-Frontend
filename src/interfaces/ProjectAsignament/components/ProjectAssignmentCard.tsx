import { useState } from 'react'
import { ProjectDto } from '../../ViewProyect/models/ProyectViewDTO.m'

interface Props {
	project: ProjectDto
}

const formatMoney = (value?: number | null) => `$${value?.toLocaleString() ?? '0'}`

const formatHours = (value?: number | null) => `${value?.toFixed(2) ?? '0.00'}h`

const formatDate = (value?: string | null) => value ?? 'Sin fecha'

const ProjectAssignmentCard = ({ project }: Props) => {
	const [open, setOpen] = useState(false)

	const statusClass = project.status?.toLowerCase() === 'active' || project.status?.toLowerCase() === 'activo' ? 'is-active' : 'is-inactive'

	return (
		<>
			<div className="project-assignment-card" onClick={() => setOpen(true)}>
				<div className="project-assignment-card__top">
					<div className="project-assignment-card__info">
						<h3>{project.name}</h3>
						<span>{project.clientName ?? 'Sin cliente'}</span>
					</div>

					<div className="project-assignment-card__code">{project.code ?? '-'}</div>
				</div>

				<div className="project-assignment-card__content">
					<div className="project-assignment-card__status">
						<span className={`project-assignment-card__status-dot ${statusClass}`} />
						<span>{project.status ?? 'Sin estado'}</span>
					</div>

					<div className="project-assignment-card__detail">
						<span>Ver detalle</span>
						<span className="material-icons">arrow_forward</span>
					</div>
				</div>

				<div className="project-assignment-card__bottom">
					<div className="project-assignment-card__footer-item">
						<span className="material-icons">monitoring</span>
						<span>{formatHours(project.bacTotalHours)}</span>
					</div>

					<div className="project-assignment-card__footer-item">
						<span className="material-icons">payments</span>
						<span>{formatMoney(project.bacTotalCost)}</span>
					</div>
				</div>
			</div>

			{open && (
				<div className="project-detail-modal">
					<div className="project-detail-modal__backdrop" onClick={() => setOpen(false)} />

					<div className="project-detail-modal__content">
						<div className="project-detail-modal__header">
							<div>
								<span className="project-detail-modal__eyebrow">Detalle del proyecto</span>
								<h2>{project.name}</h2>
								<p>{project.clientName ?? 'Sin cliente'}</p>
							</div>

							<button type="button" onClick={() => setOpen(false)}>
								<span className="material-icons">close</span>
							</button>
						</div>

						<div className="project-detail-modal__summary">
							<div className="project-detail-modal__badge">{project.code ?? '-'}</div>

							<div className="project-detail-modal__status">
								<span className={`project-assignment-card__status-dot ${statusClass}`} />
								<span>{project.status ?? 'Sin estado'}</span>
							</div>
						</div>

						<div className="project-detail-modal__section">
							<h3>Información general</h3>

							<div className="project-detail-modal__grid">
								<div className="project-detail-modal__item">
									<label>ID Proyecto</label>
									<strong>{project.id}</strong>
								</div>

								<div className="project-detail-modal__item">
									<label>Clockify ID</label>
									<strong>{project.clockifyProjectId ?? '-'}</strong>
								</div>

								<div className="project-detail-modal__item">
									<label>Cliente</label>
									<strong>{project.clientName ?? 'Sin cliente'}</strong>
								</div>

								<div className="project-detail-modal__item">
									<label>Modo ETC</label>
									<strong>{project.etcCalculationMode ?? '-'}</strong>
								</div>
							</div>
						</div>

						<div className="project-detail-modal__section">
							<h3>Presupuesto y costos</h3>

							<div className="project-detail-modal__grid project-detail-modal__grid--metrics">
								<div className="project-detail-modal__metric">
									<span className="material-icons">schedule</span>
									<label>BAC Base Horas</label>
									<strong>{formatHours(project.bacBaseHours)}</strong>
								</div>

								<div className="project-detail-modal__metric">
									<span className="material-icons">monitoring</span>
									<label>BAC Total Horas</label>
									<strong>{formatHours(project.bacTotalHours)}</strong>
								</div>

								<div className="project-detail-modal__metric">
									<span className="material-icons">attach_money</span>
									<label>BAC Base Costo</label>
									<strong>{formatMoney(project.bacBaseCost)}</strong>
								</div>

								<div className="project-detail-modal__metric">
									<span className="material-icons">payments</span>
									<label>BAC Total Costo</label>
									<strong>{formatMoney(project.bacTotalCost)}</strong>
								</div>

								<div className="project-detail-modal__metric">
									<span className="material-icons">price_change</span>
									<label>Tarifa Hora</label>
									<strong>{formatMoney(project.hourlyRate)}/h</strong>
								</div>
							</div>
						</div>

						<div className="project-detail-modal__section">
							<h3>Fechas</h3>

							<div className="project-detail-modal__grid">
								<div className="project-detail-modal__item">
									<label>Inicio</label>
									<strong>{formatDate(project.startDate)}</strong>
								</div>

								<div className="project-detail-modal__item">
									<label>Fin planificado</label>
									<strong>{formatDate(project.endDatePlanned)}</strong>
								</div>

								<div className="project-detail-modal__item">
									<label>Fin real</label>
									<strong>{formatDate(project.endDateActual)}</strong>
								</div>

								<div className="project-detail-modal__item">
									<label>Creado</label>
									<strong>{formatDate(project.createdAt)}</strong>
								</div>

								<div className="project-detail-modal__item">
									<label>Actualizado</label>
									<strong>{formatDate(project.updatedAt)}</strong>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	)
}

export default ProjectAssignmentCard
