// views/EtcEditSnapshotView.v.tsx

import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useEtcContext } from '../hooks/useEtcContext.h'
import { useEtcProjectController } from '../hooks/useEtcProjectController.h'
import { etcAdapter } from '../service/EtcAdapter'
import { ETC_LOAD_PROJECT } from '../routes/paths'
import { EtcWeeklyVersionMonthSelector } from '../components/EtcWeeklyVersionMonthSelector'
import { EtcWeeklyVersionResources } from '../components/EtcWeeklyVersionResources'
import { SectionLoader } from '../../base/components/loading/SectionLoader'

import type { GridValues } from '../model/IEtcContext.m'

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'

const getInitials = (name: string): string =>
	name
		.split(' ')
		.filter(Boolean)
		.slice(0, 2)
		.map((w) => w[0]?.toUpperCase())
		.join('')

export const EtcEditSnapshotView: FC = () => {
	const navigate = useNavigate()

	const { projectId, projectName, snapshot, bac, users, selectedUserIds, selectedMonths, values, records, loading } = useEtcContext()
	const { loadProject } = useEtcProjectController()

	const [localValues, setLocalValues] = useState<GridValues>({})
	const [saving, setSaving] = useState(false)
	const [saveErrors, setSaveErrors] = useState<{ message: string }[]>([])

	useEffect(() => {
		if (!projectId) {
			navigate(ETC_LOAD_PROJECT.ETC_LOAD, { replace: true })
		}
	}, [projectId, navigate])

	// Initialize local copy from context once data is loaded
	useEffect(() => {
		if (!loading) {
			setLocalValues(
				Object.fromEntries(
					Object.entries(values).map(([uid, months]) => [uid, { ...months }])
				)
			)
		}
	}, [loading, values])

	const selectedUsers = users.filter((u) => selectedUserIds.has(u.Id))

	const erc = selectedUsers.reduce(
		(acc, u) => acc + selectedMonths.reduce((a, m) => a + (localValues[u.Id]?.[m] ?? 0), 0),
		0
	)

	const usePercentage = bac > 0 ? (erc / bac) * 100 : 0

	const colorClass = usePercentage >= 85 ? 'is-danger' : usePercentage >= 60 ? 'is-warning' : 'is-success'

	// =========================
	// HANDLERS
	// =========================

	const handleChange = (userId: number, month: string, value: number) => {
		setSaveErrors([])
		setLocalValues((prev) => ({
			...prev,
			[userId]: { ...prev[userId], [month]: value },
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
						hours: localValues[u.Id]?.[month] ?? 0,
					}
				})
			)

			await etcAdapter.updateBulk({ projectId, snapshotId: snapshot?.id, entries })

			await loadProject(projectId)

			logger.infoTag(LogTag.Adapter, '[ETC EDIT SNAPSHOT] Saved', { projectId })

			navigate(-1)
		} catch (e: unknown) {
			const msg = e instanceof Error ? e.message : 'Error al guardar'
			setSaveErrors(msg.split('\n').filter(Boolean).map((message) => ({ message })))
			logger.errorTag(LogTag.Adapter, '[ETC EDIT SNAPSHOT] Save error', e)
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
					<h1 className="etc-weekly-header__title">Editar {snapshot?.label ?? 'versión'}</h1>

					<p className="etc-weekly-header__subtitle">
						Proyecto: <strong>{projectName}</strong>
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
					{/* HORIZONTE DE PLANIFICACIÓN */}
					{/* ========================= */}
					<EtcWeeklyVersionMonthSelector />

					{/* ========================= */}
					{/* RECURSOS */}
					{/* ========================= */}
					<EtcWeeklyVersionResources />

					{/* ========================= */}
					{/* GRID EDITABLE */}
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
										const total = selectedMonths.reduce((acc, m) => acc + (localValues[user.Id]?.[m] ?? 0), 0)
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
															min={0}
															value={localValues[user.Id]?.[m] ?? 0}
															onChange={(e) => handleChange(user.Id, m, Number(e.target.value))}
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

							<button
								type="button"
								className="etc-weekly-actions__save"
								onClick={() => void handleSave()}
								disabled={saving || selectedUsers.length === 0 || selectedMonths.length === 0}
							>
								{saving ? 'Guardando...' : 'Guardar cambios'}
							</button>
						</footer>
					</div>
				</>
			)}
		</div>
	)
}

export default EtcEditSnapshotView
