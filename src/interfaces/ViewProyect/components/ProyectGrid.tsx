// components/ProyectGrid.tsx

import { FC, useMemo } from 'react'

import { useNavigate } from 'react-router-dom'

import { useProyectViewContext } from '../hooks/useProyectViewContext.h'

import { PROYECT_PATHS_VIEWS } from '../routes/paths'

export const ProyectGrid: FC = () => {
	const { projects, loading, error } = useProyectViewContext()

	const navigate = useNavigate()

	const sortedProjects = useMemo(
		() => [...projects].sort((a, b) => (b.code ?? '').localeCompare(a.code ?? '')),
		[projects],
	)

	// =========================
	// PROGRESS COLOR
	// =========================

	const getProgressColor = (value: number) => {
		const ratio = value / 100

		const r = Math.round(150 - 100 * ratio)

		const g = Math.round(150 + 80 * ratio)

		const b = Math.round(150 - 100 * ratio)

		return `rgb(${r}, ${g}, ${b})`
	}

	// =========================
	// EMPTY
	// =========================

	if (!loading && !error && projects.length === 0) {
		return <div className="empty">No hay proyectos disponibles</div>
	}

	return (
		<>
			{/* ========================= */}
			{/* GRID */}
			{/* ========================= */}

			<div className="grid">
				{sortedProjects.map((p) => {
					const progress = p.bacBaseHours > 0 ? Math.min(Math.round((p.etcTotalHours / p.bacBaseHours) * 100), 100) : 0

					return (
						<div className="card card--project" key={p.id} onClick={() => navigate(PROYECT_PATHS_VIEWS.PROYECT_ITEM.replace(':id', String(p.id)))}>
							{/* ========================= */}
							{/* HEADER */}
							{/* ========================= */}

							<div className="card__header">
								<div className="card__title">
									<span className="card__name">{p.name}</span>
								</div>

								<span className={`card__status card__status--${p.status}`}>{p.status}</span>
							</div>

							{/* ========================= */}
							{/* BODY */}
							{/* ========================= */}

							<div className="card__body">
								<p>
									<strong>Cliente:</strong> {p.clientName ?? '-'}
								</p>

								<p>
									<strong>Inicio:</strong> {p.tracking?.startDate ?? '-'}
								</p>

								<p>
									<strong>Fin planificado:</strong> {p.tracking?.plannedEndDate ?? '-'}
								</p>
							</div>

							{/* ========================= */}
							{/* PROGRESS */}
							{/* ========================= */}

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

							{/* ========================= */}
							{/* METRICS */}
							{/* ========================= */}

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

									<span className="metric__value">{p.etcTotalHours}h</span>
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

		</>
	)
}
