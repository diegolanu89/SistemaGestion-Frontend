/* eslint-disable react-hooks/rules-of-hooks */
import { FC, useEffect, useMemo, useState } from 'react'

import { ProjectDto } from '../models/ProyectViewDTO.m'

import { useProyectViewContext } from '../hooks/useProyectViewContext.h'

import { changeRequestAdapter } from '../services/ChangeAdapter.s'

interface Props {
	project: ProjectDto
}

interface MetricHeaderProps {
	title: string

	description: string

	onInfo: (title: string, description: string) => void
}

const MetricHeader: FC<MetricHeaderProps> = ({ title, description, onInfo }) => {
	return (
		<div className="project-detail-metric__header">
			<span className="project-detail-metric__label">{title}</span>

			<button type="button" className="project-detail-metric__info" onClick={() => onInfo(title, description)}>
				<span className="material-icons">info</span>
			</button>
		</div>
	)
}

export const ProyectViewItemMetrics: FC<Props> = ({ project }) => {
	const { changeRequests, setChangeRequests, changeRequestsLoading, setChangeRequestsLoading } = useProyectViewContext()

	const [popover, setPopover] = useState<{
		title: string
		description: string
	} | null>(null)

	const [loadedProjects, setLoadedProjects] = useState<Set<number>>(new Set())

	useEffect(() => {
		if (loadedProjects.has(project.id)) {
			return
		}
		const loadChanges = async () => {
			try {
				setChangeRequestsLoading(true)
				const response = await changeRequestAdapter.getByProject(project.id)
				setChangeRequests((previous) => {
					const merged = [...previous]
					response.forEach((item) => {
						const exists = merged.some((x) => x.id === item.id)
						if (!exists) {
							merged.push(item)
						}
					})
					return merged
				})
				setLoadedProjects((prev) => new Set(prev).add(project.id))
			} catch (error) {
				console.error(error)
			} finally {
				setChangeRequestsLoading(false)
			}
		}
		void loadChanges()
	}, [project.id])

	const approvedChanges = useMemo(() => {
		return changeRequests.filter((x) => x.projectId === project.id && (x.status === 'aprobado' || x.status === 'implementado'))
	}, [changeRequests, project.id])

	const approvedChangesHours = useMemo(() => {
		return approvedChanges.reduce((acc, current) => acc + Number(current.bacHoursIncrement ?? 0), 0)
	}, [approvedChanges])

	const approvedChangesCost = useMemo(() => {
		return approvedChanges.reduce((acc, current) => acc + Number(current.bacCostIncrement ?? 0), 0)
	}, [approvedChanges])

	const adjustedBacHours = Number(project.bacBaseHours ?? 0) + approvedChangesHours

	const adjustedBacCost = Number(project.bacBaseCost ?? 0) + approvedChangesCost

	const acTotal = adjustedBacHours * 0.62

	const etc = project.etcHours ?? Math.max(adjustedBacHours - acTotal, 0)

	const ev = acTotal * 0.92

	const eac = acTotal + etc

	const vac = adjustedBacHours - eac

	const advance = adjustedBacHours > 0 ? Math.round((ev / adjustedBacHours) * 100) : 0

	const cpi = acTotal > 0 ? (ev / acTotal).toFixed(2) : '0.00'

	const spi = adjustedBacHours > 0 ? (ev / adjustedBacHours).toFixed(2) : '0.00'

	const vacClass =
		vac < 0 ? 'project-detail-metric--danger' : vac < adjustedBacHours * 0.1 ? 'project-detail-metric--warning' : 'project-detail-metric--healthy'

	const cpiClass = Number(cpi) < 1 ? 'project-detail-metric--danger' : Number(cpi) < 1.1 ? 'project-detail-metric--warning' : 'project-detail-metric--healthy'

	const spiClass = Number(spi) < 1 ? 'project-detail-metric--danger' : Number(spi) < 1.1 ? 'project-detail-metric--warning' : 'project-detail-metric--healthy'

	if (changeRequestsLoading) {
		return (
			<div className="project-detail-metrics">
				{Array.from({ length: 9 }).map((_, index) => (
					<div key={index} className="project-detail-metric-skeleton">
						<div className="project-detail-metric-skeleton__label" />

						<div className="project-detail-metric-skeleton__value" />

						<div className="project-detail-metric-skeleton__line" />

						<div className="project-detail-metric-skeleton__row" />

						<div className="project-detail-metric-skeleton__row small" />
					</div>
				))}
			</div>
		)
	}

	return (
		<>
			<div className="project-detail-metrics">
				<div className="project-detail-metric project-detail-metric--bac">
					<MetricHeader
						title="BAC Ajustado"
						description="Representa el presupuesto total actualizado del proyecto considerando todos los controles de cambio aprobados e implementados."
						onInfo={(title, description) =>
							setPopover({
								title,
								description,
							})
						}
					/>

					<strong>{adjustedBacHours.toFixed(1)}h</strong>

					<div className="project-detail-metric__separator" />

					<div className="project-detail-metric__row">
						<span>BAC Base</span>

						<strong>{Number(project.bacBaseHours ?? 0).toFixed(1)}h</strong>
					</div>

					<div className="project-detail-metric__row">
						<span>Cambios aprobados</span>

						<strong>+{approvedChangesHours.toFixed(1)}h</strong>
					</div>

					<div className="project-detail-metric__row">
						<span>Impacto económico</span>

						<strong>${adjustedBacCost.toLocaleString()}</strong>
					</div>
				</div>

				<div className="project-detail-metric project-detail-metric--ac">
					<MetricHeader
						title="AC"
						description="Actual Cost: representa el costo o esfuerzo real actualmente consumido por el proyecto."
						onInfo={(title, description) =>
							setPopover({
								title,
								description,
							})
						}
					/>

					<strong>{acTotal.toFixed(1)}h</strong>
				</div>

				<div className="project-detail-metric project-detail-metric--ev">
					<MetricHeader
						title="EV"
						description="Earned Value: representa el valor realmente ganado según el avance ejecutado."
						onInfo={(title, description) =>
							setPopover({
								title,
								description,
							})
						}
					/>

					<strong>{ev.toFixed(1)}h</strong>
				</div>

				<div className="project-detail-metric project-detail-metric--etc">
					<MetricHeader
						title="ETC"
						description="Estimate To Complete: esfuerzo estimado restante necesario para finalizar el proyecto."
						onInfo={(title, description) =>
							setPopover({
								title,
								description,
							})
						}
					/>

					<strong>{etc.toFixed(1)}h</strong>
				</div>

				<div className="project-detail-metric project-detail-metric--eac">
					<MetricHeader
						title="EAC"
						description="Estimate At Completion: proyección total del esfuerzo final esperado del proyecto."
						onInfo={(title, description) =>
							setPopover({
								title,
								description,
							})
						}
					/>

					<strong>{eac.toFixed(1)}h</strong>
				</div>

				<div className={`project-detail-metric project-detail-metric--vac ${vacClass}`}>
					<MetricHeader
						title="VAC"
						description="Variance At Completion: diferencia proyectada entre el BAC ajustado y el costo final estimado."
						onInfo={(title, description) =>
							setPopover({
								title,
								description,
							})
						}
					/>

					<strong>{vac.toFixed(1)}h</strong>
				</div>

				<div className="project-detail-metrics__mini-kpis">
					<div className={`project-detail-metric project-detail-metric--cpi ${cpiClass}`}>
						<MetricHeader
							title="CPI"
							description="Cost Performance Index: mide la eficiencia de costos del proyecto."
							onInfo={(title, description) =>
								setPopover({
									title,
									description,
								})
							}
						/>

						<strong>{cpi}</strong>
					</div>

					<div className={`project-detail-metric project-detail-metric--spi ${spiClass}`}>
						<MetricHeader
							title="SPI"
							description="Schedule Performance Index: mide la eficiencia del cronograma respecto al avance esperado."
							onInfo={(title, description) =>
								setPopover({
									title,
									description,
								})
							}
						/>

						<strong>{spi}</strong>
					</div>

					<div className="project-detail-metric project-detail-metric--advance">
						<MetricHeader
							title="Avance"
							description="Porcentaje estimado de avance real considerando el valor ganado sobre el BAC ajustado."
							onInfo={(title, description) =>
								setPopover({
									title,
									description,
								})
							}
						/>

						<strong>%{advance}</strong>
					</div>
				</div>
			</div>

			{popover && (
				<div className="project-detail-global-popover-backdrop" onClick={() => setPopover(null)}>
					<div className="project-detail-global-popover" onClick={(event) => event.stopPropagation()}>
						<div className="project-detail-global-popover__header">
							<h3>{popover.title}</h3>

							<button type="button" onClick={() => setPopover(null)}>
								<span className="material-icons">close</span>
							</button>
						</div>

						<p>{popover.description}</p>
					</div>
				</div>
			)}
		</>
	)
}
