// views/EtcViewBaselineView.v.tsx

import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useEtcContext } from '../hooks/useEtcContext.h'
import { etcAdapter } from '../service/EtcAdapter'
import { ETC_LOAD_PROJECT } from '../routes/paths'

import { SectionLoader } from '../../base/components/loading/SectionLoader'

import type { EtcRecordDto } from '../model/Etc.m'
import type { EtcSnapshotDto } from '../model/IEtcApi.m'

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'

const formatDate = (iso: string): string =>
	new Date(iso).toLocaleString('es-AR', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})

const getInitials = (fullName: string): string =>
	fullName
		.split(' ')
		.filter(Boolean)
		.slice(0, 2)
		.map((w) => w[0]?.toUpperCase())
		.join('')

export const EtcViewBaselineView: FC = () => {
	const navigate = useNavigate()
	const { projectId, projectName, bac } = useEtcContext()

	const [records, setRecords] = useState<EtcRecordDto[]>([])
	const [baselineSnapshot, setBaselineSnapshot] = useState<EtcSnapshotDto | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (!projectId) {
			navigate(ETC_LOAD_PROJECT.ETC_LOAD, { replace: true })
			return
		}

		let cancelled = false

		void (async () => {
			setLoading(true)

			try {
				const response = await etcAdapter.getByProject(projectId, 'baseline')

				if (!cancelled) {
					setRecords(response.records ?? [])
					setBaselineSnapshot(response.snapshot)
				}

				logger.infoTag(LogTag.Adapter, '[ETC VIEW BASELINE] Loaded', { projectId })
			} catch (e: unknown) {
				logger.errorTag(LogTag.Adapter, '[ETC VIEW BASELINE] Load error', e)
			} finally {
				if (!cancelled) setLoading(false)
			}
		})()

		return () => {
			cancelled = true
		}
	}, [projectId, navigate])

	// =========================
	// DERIVAR DATOS
	// =========================


	const users = [...new Set(records.map((r) => r.userName ?? ''))].filter(Boolean)

	const months = [...new Set(records.map((r) => r.monthKey))].sort()

	const erc = records.reduce((acc, r) => acc + Number(r.hours), 0)

	const usePercentage = bac > 0 ? (erc / bac) * 100 : 0

	const colorClass = usePercentage >= 85 ? 'is-danger' : usePercentage >= 60 ? 'is-warning' : 'is-success'

	const remaining = Math.max(0, bac - erc)

	const noBac = bac <= 0

	const rangeLabel = months.length > 0 ? `${months[0]} → ${months[months.length - 1]}` : '—'

	const matrix: Record<string, Record<string, number>> = {}

	records.forEach((r) => {
		const user = r.userName ?? ''
		if (!matrix[user]) matrix[user] = {}
		matrix[user][r.monthKey] = Number(r.hours)
	})

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
					<h1 className="etc-weekly-header__title">Actualizar línea base</h1>

					<p className="etc-weekly-header__subtitle">
						Visualización de la línea base del proyecto: <strong>{projectName}</strong>
					</p>

					{baselineSnapshot?.created_at && (
						<p className="etc-weekly-header__meta">
							<span>Creada el {formatDate(baselineSnapshot.created_at)}</span>
						</p>
					)}
				</div>
			</header>

			{loading ? (
				<SectionLoader text="Cargando línea base..." />
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

							<div className={`etc-weekly-mini-card etc-weekly-mini-card--erc ${noBac ? '' : colorClass}`}>
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

								<strong>{noBac ? 'Sin BAC' : `${usePercentage.toFixed(1)}%`}</strong>
							</div>

							{noBac ? (
								<div className="etc-weekly-progress">
									<div className="etc-weekly-progress__bar">
										<div className="etc-weekly-progress__fill etc-weekly-progress__fill--no-bac" style={{ width: erc > 0 ? '100%' : '0%' }} />
									</div>

									<div className="etc-weekly-progress__legend">
										<span>{erc.toFixed(2)}h comprometidas</span>

										<span className="etc-weekly-progress__legend--warning">BAC no definido en el proyecto</span>
									</div>
								</div>
							) : (
								<div className="etc-weekly-progress">
									<div className="etc-weekly-progress__bar">
										<div className={`etc-weekly-progress__fill ${colorClass}`} style={{ width: `${Math.min(usePercentage, 100)}%` }} />
									</div>

									<div className="etc-weekly-progress__legend">
										<span>{erc.toFixed(2)}h utilizadas</span>

										<span>{remaining.toFixed(2)}h disponibles</span>
									</div>
								</div>
							)}
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
							{months.map((month) => (
								<div key={month} className="etc-weekly-months__chip">
									<span>{month}</span>

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
							{users.map((userName) => (
								<label key={userName} className="etc-weekly-user is-selected">
									<input type="checkbox" checked disabled onChange={() => undefined} />

									<span>{userName}</span>
								</label>
							))}
						</div>
					</section>

					{/* ========================= */}
					{/* GRID (READ-ONLY) */}
					{/* ========================= */}

					{records.length === 0 ? (
						<p className="empty">No hay registros en la línea base.</p>
					) : (
						<div className="etc-weekly-grid">
							<table className="etc-weekly-grid__table">
								<thead>
									<tr>
										<th></th>

										<th>Usuario</th>

										{months.map((m) => (
											<th key={m}>{m}</th>
										))}

										<th>Total</th>
									</tr>
								</thead>

								<tbody>
									{users.map((user) => {
										const total = months.reduce((acc, m) => acc + (matrix[user]?.[m] ?? 0), 0)

										return (
											<tr key={user}>
												<td className="etc-weekly-grid__avatar-cell">
													<div className="etc-weekly-grid__avatar">{getInitials(user)}</div>
												</td>

												<td>{user}</td>

												{months.map((m) => (
													<td key={m}>
														<input type="number" value={matrix[user]?.[m] ?? 0} disabled onChange={() => undefined} />
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
							Actualizar línea base
						</button>
					</footer>
				</>
			)}
		</div>
	)
}

export default EtcViewBaselineView
