// components/ProyectGrid.tsx

import { FC, useMemo } from 'react'
import { useProyectViewContext } from '../hooks/useProyectViewContext.h'
import { useNavigate } from 'react-router-dom'

export const ProyectGrid: FC = () => {
	const { projects, filters, loading, error } = useProyectViewContext()
	const navigate = useNavigate()

	const filteredProjects = useMemo(() => {
		return projects.filter((p) => {
			const matchesSearch = p.name.toLowerCase().includes(filters.search.toLowerCase())
			const matchesClient = filters.client === 'all' || p.clientName === filters.client
			const matchesStatus = filters.status === 'all' || p.status === filters.status
			const matchesCode = filters.code === 'all' || p.code === filters.code

			return matchesSearch && matchesClient && matchesStatus && matchesCode
		})
	}, [projects, filters])

	const getProgressColor = (value: number) => {
		const ratio = value / 100

		const r = Math.round(150 - 100 * ratio)
		const g = Math.round(150 + 80 * ratio)
		const b = Math.round(150 - 100 * ratio)

		return `rgb(${r}, ${g}, ${b})`
	}

	if (!loading && !error && filteredProjects.length === 0) {
		return <div className="empty">No hay proyectos disponibles</div>
	}

	return (
		<div className="grid">
			{filteredProjects.map((p) => {
				const progress = p.hourlyRate ?? 0

				return (
					<div className="card card--project" key={p.id} onClick={() => navigate(`/projects/${p.id}`)}>
						{/* HEADER */}
						<div className="card__header">
							<div className="card__title">
								<span className="card__code">{p.code}</span>
								<span className="card__separator">-</span>
								<span className="card__name">{p.name}</span>
							</div>

							<span className={`card__status card__status--${p.status}`}>{p.status}</span>
						</div>

						{/* BODY */}
						<div className="card__body">
							<p>
								<strong>Cliente:</strong> {p.clientName ?? '-'}
							</p>

							<p>
								<strong>Inicio:</strong> {p.startDate ?? '-'}
							</p>

							<p>
								<strong>Fin planificado:</strong> {p.endDatePlanned ?? '-'}
							</p>
						</div>

						{/* PROGRESS */}
						<div className="card__progress-wrapper">
							<div className="card__progress">
								<div
									className="card__progress-bar"
									style={{
										width: `${progress}%`,
										background: `linear-gradient(
											90deg,
											var(--color-primary),
											${getProgressColor(progress)}
										)`,
									}}
								/>
							</div>

							<span className="card__progress-label">%{progress}</span>
						</div>

						{/* METRICS */}
						<div className="card__metrics">
							<button className="metric metric--primary" data-tooltip="Presupuesto total del proyecto">
								<span className="metric__label">BAC</span>
								<span className="metric__value">${p.bacTotalCost}</span>
							</button>
							<button className="metric metric--secondary" data-tooltip="Horas totales del proyecto">
								<span className="metric__label">Horas</span>
								<span className="metric__value">{p.bacTotalHours}h</span>
							</button>
							<button className="metric metric--etc" data-tooltip="Estimación restante del proyecto">
								<span className="metric__label">ETC</span>
								<span className="metric__value">{p.etcHours ?? 0}h</span>
							</button>
							<button className="metric metric--success" data-tooltip="Costo base inicial">
								<span className="metric__label">Base $</span>
								<span className="metric__value">${p.bacBaseCost}</span>
							</button>
							<button className="metric metric--warning" data-tooltip="Horas base iniciales">
								<span className="metric__label">Base Hs</span>
								<span className="metric__value">{p.bacBaseHours}h</span>
							</button>
						</div>
					</div>
				)
			})}
		</div>
	)
}
