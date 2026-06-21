// views/EtcEditBaselineView.v.tsx

import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useEtcContext } from '../hooks/useEtcContext.h'
import { useEtcProjectController } from '../hooks/useEtcProjectController.h'
import { etcAdapter } from '../service/EtcAdapter'
import { ETC_LOAD_PROJECT } from '../routes/paths'

import { EtcWeeklyVersionMonthSelector } from '../components/EtcWeeklyVersionMonthSelector'
import { EtcWeeklyVersionResources } from '../components/EtcWeeklyVersionResources'
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

export const EtcEditBaselineView: FC = () => {
	const navigate = useNavigate()
	const { projectId, projectName, bac, selectedMonths, setSelectedMonths, users: allUsers, selectedUserIds } = useEtcContext()

	const selectedUsers = allUsers.filter((u) => selectedUserIds.has(u.Id))
	const { loadProject } = useEtcProjectController()

	const [records, setRecords] = useState<EtcRecordDto[]>([])
	const [baselineSnapshot, setBaselineSnapshot] = useState<EtcSnapshotDto | null>(null)
	const [loading, setLoading] = useState(true)

	// Editable matrix: userName -> monthKey -> hours
	const [editValues, setEditValues] = useState<Record<string, Record<string, number>>>({})
	const [saving, setSaving] = useState(false)
	const [saveErrors, setSaveErrors] = useState<{ message: string }[]>([])

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
					const loaded = response.records ?? []
					setRecords(loaded)
					setBaselineSnapshot(response.snapshot)

					const m: Record<string, Record<string, number>> = {}
					loaded.forEach((r) => {
						const user = r.userName ?? ''
						if (!m[user]) m[user] = {}
						m[user][r.monthKey] = Number(r.hours)
					})
					setEditValues(m)

					const loadedMonths = [...new Set(loaded.map((r) => r.monthKey))].sort()
					setSelectedMonths(loadedMonths)
				}

				logger.infoTag(LogTag.Adapter, '[ETC EDIT BASELINE] Loaded', { projectId })
			} catch (e: unknown) {
				logger.errorTag(LogTag.Adapter, '[ETC EDIT BASELINE] Load error', e)
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

	const erc = selectedUsers.reduce((acc, u) => acc + selectedMonths.reduce((a, m) => a + (editValues[u.FullName]?.[m] ?? 0), 0), 0)

	const usePercentage = bac > 0 ? (erc / bac) * 100 : 0

	const colorClass = usePercentage >= 85 ? 'is-danger' : usePercentage >= 60 ? 'is-warning' : 'is-success'

	const remaining = Math.max(0, bac - erc)

	const noBac = bac <= 0

	// =========================
	// HANDLERS
	// =========================

	const handleChange = (user: string, month: string, value: number) => {
		setSaveErrors([])
		setEditValues((prev) => ({
			...prev,
			[user]: { ...prev[user], [month]: value },
		}))
	}

	const handleSave = async () => {
		setSaving(true)
		setSaveErrors([])

		try {
			const entries = selectedUsers.flatMap((u) =>
				selectedMonths.map((month) => {
					const existing = records.find((r) => r.userName === u.FullName && r.monthKey === month)
					return {
						...(existing ? { id: existing.id } : {}),
						userName: u.FullName,
						monthKey: month,
						hours: editValues[u.FullName]?.[month] ?? 0,
					}
				})
			)

			await etcAdapter.updateBulk({ projectId, snapshotId: baselineSnapshot?.id, entries })

			await loadProject(projectId)

			logger.infoTag(LogTag.Adapter, '[ETC EDIT BASELINE] Saved', { projectId })

			navigate(-1)
		} catch (e: unknown) {
			const msg = e instanceof Error ? e.message : 'Error al guardar'
			setSaveErrors(msg.split('\n').filter(Boolean).map((message) => ({ message })))
			logger.errorTag(LogTag.Adapter, '[ETC EDIT BASELINE] Save error', e)
		} finally {
			setSaving(false)
		}
	}

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
					<h1 className="etc-weekly-header__title">Editar línea base</h1>

					<p className="etc-weekly-header__subtitle">
						Proyecto: <strong>{projectName}</strong>
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
					{/* HORIZONTE DE PLANIFICACIÃ“N */}
					{/* ========================= */}

					<EtcWeeklyVersionMonthSelector />

					{/* ========================= */}
					{/* RECURSOS */}
					{/* ========================= */}

					<EtcWeeklyVersionResources />

					{/* ========================= */}
					{/* GRID EDITABLE */}
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

										{selectedMonths.map((m) => (
											<th key={m}>{m}</th>
										))}

										<th>Total</th>
									</tr>
								</thead>

								<tbody>
									{selectedUsers.map((u) => {
										const total = selectedMonths.reduce((acc, m) => acc + (editValues[u.FullName]?.[m] ?? 0), 0)

										return (
											<tr key={u.Id}>
												<td className="etc-weekly-grid__avatar-cell">
													<div className="etc-weekly-grid__avatar">{getInitials(u.FullName)}</div>
												</td>

												<td>{u.FullName}</td>

												{selectedMonths.map((m) => (
													<td key={m}>
														<input type="number" min={0} value={editValues[u.FullName]?.[m] ?? 0} onChange={(e) => handleChange(u.FullName, m, Number(e.target.value))} />
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

					<div className="etc-weekly-actions-wrapper">
						{saveErrors.length > 0 && (
							<ul className="etc-weekly-actions__errors">
								{saveErrors.map((err, i) => (
									<li key={i} className="etc-weekly-actions__error-item">{err.message}</li>
								))}
							</ul>
						)}

						<footer className="etc-weekly-actions">
							<button type="button" className="etc-weekly-actions__cancel" onClick={() => navigate(-1)} disabled={saving}>
								Volver
							</button>

							<button type="button" className="etc-weekly-actions__save" onClick={() => void handleSave()} disabled={saving || records.length === 0 || selectedUsers.length === 0 || selectedMonths.length === 0}>
								{saving ? 'Guardando...' : 'Actualizar línea base'}
							</button>
						</footer>
					</div>
				</>
			)}
		</div>
	)
}

export default EtcEditBaselineView
