// views/EtcEditSnapshotView.v.tsx
// Read-only view of the latest snapshot. Editing disabled pending backend endpoint.

import { FC, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useEtcContext } from '../hooks/useEtcContext.h'
import { ETC_LOAD_PROJECT } from '../routes/paths'
import { SectionLoader } from '../../base/components/loading/SectionLoader'

const getInitials = (name: string): string =>
	name
		.split(' ')
		.filter(Boolean)
		.slice(0, 2)
		.map((w) => w[0]?.toUpperCase())
		.join('')

export const EtcEditSnapshotView: FC = () => {
	const navigate = useNavigate()

	const { projectId, projectName, snapshot, bac, users, selectedUserIds, selectedMonths, values, loading } = useEtcContext()

	useEffect(() => {
		if (!projectId) {
			navigate(ETC_LOAD_PROJECT.ETC_LOAD, { replace: true })
		}
	}, [projectId, navigate])

	const selectedUsers = users.filter((u) => selectedUserIds.has(u.Id))

	const erc = selectedUsers.reduce(
		(acc, u) => acc + selectedMonths.reduce((a, m) => a + (values[u.Id]?.[m] ?? 0), 0),
		0
	)

	const usePercentage = bac > 0 ? (erc / bac) * 100 : 0

	const colorClass = usePercentage >= 85 ? 'is-danger' : usePercentage >= 60 ? 'is-warning' : 'is-success'

	const rangeLabel =
		selectedMonths.length > 0 ? `${selectedMonths[0]} → ${selectedMonths[selectedMonths.length - 1]}` : '—'

	return (
		<div className="etc-weekly-version">
			{/* ========================= */}
			{/* HEADER */}
			{/* ========================= */}
			<header className="etc-weekly-header">
				<button type="button" className="etc-weekly-header__back" onClick={() => navigate(-1)}>
					<span className="material-icons">arrow_back</span>
				</button>

				<div>
					<h1 className="etc-weekly-header__title">Editar {snapshot?.label ?? 'versión'}</h1>

					<p className="etc-weekly-header__subtitle">
						Visualización del snapshot para el proyecto: <strong>{projectName}</strong>
					</p>

					<p className="etc-weekly-header__meta etc-weekly-header__meta--warning">
						<span className="material-icons" style={{ fontSize: 15, verticalAlign: 'middle', marginRight: 4 }}>
							lock
						</span>
						Edición no disponible — pendiente de implementación del endpoint.
					</p>
				</div>
			</header>

			{loading ? (
				<SectionLoader text="Cargando versión..." />
			) : (
				<>
					{/* ========================= */}
					{/* MÉTRICAS */}
					{/* ========================= */}
					<section className="etc-weekly-metrics">
						<div className="etc-weekly-metrics__cards">
							<div className="etc-weekly-mini-card etc-weekly-mini-card--bac">
								<div className="etc-weekly-mini-card__icon">
									<span className="material-icons">account_balance_wallet</span>
								</div>
								<div className="etc-weekly-mini-card__content">
									<span className="etc-weekly-mini-card__label">BAC</span>
									<strong className="etc-weekly-mini-card__value">{bac.toFixed(2)}h</strong>
								</div>
							</div>

							<div className={`etc-weekly-mini-card etc-weekly-mini-card--erc ${bac > 0 ? colorClass : ''}`}>
								<div className="etc-weekly-mini-card__icon">
									<span className="material-icons">query_stats</span>
								</div>
								<div className="etc-weekly-mini-card__content">
									<span className="etc-weekly-mini-card__label">ERC / ETC</span>
									<strong className="etc-weekly-mini-card__value">{erc.toFixed(2)}h</strong>
								</div>
							</div>
						</div>

						<div className="etc-weekly-progress-card">
							<div className="etc-weekly-progress-card__header">
								<div>
									<h4>Use BAC</h4>
									<p>Porcentaje utilizado del BAC total del proyecto.</p>
								</div>
								<strong>{bac > 0 ? `${usePercentage.toFixed(1)}%` : 'Sin BAC'}</strong>
							</div>

							<div className="etc-weekly-progress">
								<div className="etc-weekly-progress__bar">
									<div
										className={`etc-weekly-progress__fill ${bac > 0 ? colorClass : 'etc-weekly-progress__fill--no-bac'}`}
										style={{ width: bac > 0 ? `${Math.min(usePercentage, 100)}%` : erc > 0 ? '100%' : '0%' }}
									/>
								</div>
							</div>
						</div>
					</section>

					{/* ========================= */}
					{/* MESES (READ-ONLY) */}
					{/* ========================= */}
					<section className="etc-weekly-months">
						<div className="etc-weekly-months__header">
							<div className="etc-weekly-months__title-group">
								<h3>Meses incluidos</h3>
								<div className="etc-weekly-months__range">
									<span className="material-icons">calendar_month</span>
									<span>{rangeLabel}</span>
								</div>
							</div>
							<div className="etc-weekly-months__actions">
								<input type="month" className="etc-weekly-months__picker" disabled defaultValue="" />
								<button type="button" className="etc-weekly-months__add" disabled>
									<span className="material-icons">add</span>
									Agregar mes
								</button>
							</div>
						</div>
						<div className="etc-weekly-months__chips">
							{selectedMonths.map((m) => (
								<div key={m} className="etc-weekly-months__chip">
									<span>{m}</span>
									<button type="button" disabled>
										<span className="material-icons">close</span>
									</button>
								</div>
							))}
						</div>
					</section>

					{/* ========================= */}
					{/* RECURSOS (READ-ONLY) */}
					{/* ========================= */}
					<section className="etc-weekly-users">
						<div className="etc-weekly-users__search">
							<span className="material-icons">search</span>
							<input type="text" placeholder="Buscar usuario..." disabled />
						</div>
						<div className="etc-weekly-users__grid">
							{selectedUsers.map((u) => (
								<label key={u.Id} className="etc-weekly-user is-selected">
									<input type="checkbox" checked disabled onChange={() => undefined} />
									<span>{u.FullName}</span>
								</label>
							))}
						</div>
					</section>

					{/* ========================= */}
					{/* GRID (READ-ONLY) */}
					{/* ========================= */}
					{selectedUsers.length === 0 ? (
						<p className="empty">No hay registros en este snapshot.</p>
					) : (
						<div className="etc-weekly-grid">
							<table className="etc-weekly-grid__table">
								<thead>
									<tr>
										<th></th>
										<th>Usuario</th>
										{selectedMonths.map((m) => (
											<th key={m}>{m}</th>
										))}
										<th>Total</th>
									</tr>
								</thead>
								<tbody>
									{selectedUsers.map((user) => {
										const total = selectedMonths.reduce((acc, m) => acc + (values[user.Id]?.[m] ?? 0), 0)
										return (
											<tr key={user.Id}>
												<td className="etc-weekly-grid__avatar-cell">
													<div className="etc-weekly-grid__avatar">{getInitials(user.FullName)}</div>
												</td>
												<td>{user.FullName}</td>
												{selectedMonths.map((m) => (
													<td key={m}>
														<input
															type="number"
															value={values[user.Id]?.[m] ?? 0}
															disabled
															onChange={() => undefined}
														/>
													</td>
												))}
												<td>
													<strong>{total}</strong>
												</td>
											</tr>
										)
									})}
								</tbody>
							</table>
						</div>
					)}

					{/* ========================= */}
					{/* FOOTER */}
					{/* ========================= */}
					<footer className="etc-weekly-actions">
						<button type="button" className="etc-weekly-actions__cancel" onClick={() => navigate(-1)}>
							Volver
						</button>

						<button type="button" className="etc-weekly-actions__save" disabled>
							Guardar cambios
						</button>
					</footer>
				</>
			)}
		</div>
	)
}

export default EtcEditSnapshotView
