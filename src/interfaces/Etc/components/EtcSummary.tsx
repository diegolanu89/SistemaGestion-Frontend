// components/EtcSummary.tsx

import { FC, useState, useCallback, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { useEtcContext } from '../hooks/useEtcContext.h'
import { EtcTable } from './EtcTable'
import { etcAdapter } from '../service/EtcAdapter'

import { ETC_LOAD_PROJECT } from '../routes/paths'

import type { EtcEntryDto } from '../model/Etc.m'
import type { EtcSnapshotDto } from '../model/IEtcApi.m'

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'

export const EtcSummary: FC = () => {
	const { entries, errors, projectId, snapshot } = useEtcContext()
	const navigate = useNavigate()

	// =========================
	// BASELINE TOGGLE STATE
	// =========================

	const [showBaseline, setShowBaseline] = useState(false)
	const [baselineEntries, setBaselineEntries] = useState<EtcEntryDto[]>([])
	const [baselineSnapshot, setBaselineSnapshot] = useState<EtcSnapshotDto | null>(null)
	const [loadingBaseline, setLoadingBaseline] = useState(false)
	const [showEditModal, setShowEditModal] = useState(false)

	useEffect(() => {
		setShowBaseline(false)
		setBaselineEntries([])
		setBaselineSnapshot(null)
	}, [projectId])

	// =========================
	// SUMMARY
	// =========================

	const summary = useMemo(() => {
		const totalHours = entries.reduce((acc, e) => acc + Number(e.hours), 0)
		const users = new Set(entries.map((e) => e.userName)).size
		const months = new Set(entries.map((e) => e.monthKey)).size

		return {
			totalHours,
			users,
			months,
			errorsCount: errors.length,
		}
	}, [entries, errors])

	// =========================
	// VERSION SUBTITLE
	// =========================

	const versionSubtitle = useMemo(() => {
		if (!snapshot) return null
		if (showBaseline && baselineSnapshot) {
			return `${snapshot.label} vs. ${baselineSnapshot.label}`
		}
		return snapshot.label
	}, [snapshot, showBaseline, baselineSnapshot])

	// =========================
	// BASELINE TOGGLE
	// =========================

	const onlyBaselineExists = snapshot !== null && snapshot.version === 1

	const handleToggleBaseline = useCallback(async () => {
		if (showBaseline) {
			setShowBaseline(false)
			return
		}

		if (baselineSnapshot !== null) {
			setShowBaseline(true)
			return
		}

		try {
			setLoadingBaseline(true)

			const response = await etcAdapter.getByProject(projectId, 'baseline')

			const mapped: EtcEntryDto[] = (response.records ?? []).map((r) => ({
				userName: r.userName ?? 'Sin usuario',
				monthKey: r.monthKey,
				monthLabel: r.monthLabel ?? r.monthKey,
				hours: Number(r.hours ?? 0),
			}))

			setBaselineEntries(mapped)
			setBaselineSnapshot(response.snapshot)
			setShowBaseline(true)
		} catch (e: unknown) {
			logger.errorTag(LogTag.Adapter, '[ETC SUMMARY] Load baseline error', e)
		} finally {
			setLoadingBaseline(false)
		}
	}, [showBaseline, projectId, baselineSnapshot])

	// =========================
	// NAVIGATION
	// =========================

	const handleEditSnapshot = () => {
		if (!snapshot) return
		if (snapshot.version === 1) {
			// Only baseline exists — go directly to baseline editor
			logger.infoTag(LogTag.Navigation, '[ETC] Edit baseline (direct)')
			navigate(ETC_LOAD_PROJECT.ETC_EDIT_BASELINE, { state: { projectId } })
		} else {
			// Weekly versions exist — open bifurcation modal
			setShowEditModal(true)
		}
	}

	const handleEditBaseline = () => {
		setShowEditModal(false)
		logger.infoTag(LogTag.Navigation, '[ETC] Edit baseline')
		navigate(ETC_LOAD_PROJECT.ETC_EDIT_BASELINE, { state: { projectId } })
	}

	const handleEditWeekly = () => {
		setShowEditModal(false)
		logger.infoTag(LogTag.Navigation, '[ETC] Edit snapshot')
		navigate(ETC_LOAD_PROJECT.ETC_EDIT_SNAPSHOT, { state: { projectId } })
	}

	const handleNewVersion = () => {
		logger.infoTag(LogTag.Adapter, '[ETC] Create weekly snapshot')
		navigate(ETC_LOAD_PROJECT.ETC_WEEKLY_VERSION, { state: { projectId } })
	}

	const handleCreateBaseline = () => {
		logger.infoTag(LogTag.Adapter, '[ETC] Create baseline')
		navigate(ETC_LOAD_PROJECT.ETC_BASELINE, { state: { projectId } })
	}

	return (
		<div className="etc-summary">
			{/* =========================
			    HEADER
			========================= */}
			<div className="etc-summary__header">
				<div className="etc-summary__titles">
					{versionSubtitle ? (
						<h2 className="etc-summary__version-label">{versionSubtitle}</h2>
					) : (
						<h2 className="etc-summary__title">Línea Base</h2>
					)}

					<p className="etc-summary__subtitle">
						Visualización y control de versiones semanales de la planificación ETC del proyecto. Permite comparar la evolución y generar snapshots para
						seguimiento.
					</p>
				</div>

				<div className="etc-summary__actions">
					{snapshot !== null && (
						<>
							<button
								className={`etc-summary__btn ${showBaseline ? 'etc-summary__btn--active' : 'etc-summary__btn--ghost'}`}
								onClick={() => void handleToggleBaseline()}
								disabled={onlyBaselineExists || loadingBaseline}
								title={onlyBaselineExists ? 'No hay versiones semanales para comparar' : undefined}
							>
								<span className="material-icons etc-summary__icon">{showBaseline ? 'visibility_off' : 'visibility'}</span>
								Visualizar línea base
							</button>

							<button className="etc-summary__btn etc-summary__btn--ghost" onClick={handleEditSnapshot}>
								<span className="material-icons etc-summary__icon">edit</span>
								Editar snapshot
							</button>
						</>
					)}

					{snapshot === null ? (
						<button className="etc-summary__btn etc-summary__btn--primary" onClick={handleCreateBaseline}>
							<span className="material-icons etc-summary__icon">add</span>
							Crear línea base
						</button>
					) : (
						<button className="etc-summary__btn etc-summary__btn--primary" onClick={handleNewVersion}>
							<span className="material-icons etc-summary__icon">add</span>
							Nueva versión semanal
						</button>
					)}
				</div>
			</div>

			{/* =========================
			    CARDS
			========================= */}
			<div className="etc-summary__cards">
				<div className="etc-summary__card">
					<span>Total horas</span>
					<strong>{summary.totalHours}h</strong>
				</div>

				<div className="etc-summary__card">
					<span>Usuarios</span>
					<strong>{summary.users}</strong>
				</div>

				<div className="etc-summary__card">
					<span>Meses</span>
					<strong>{summary.months}</strong>
				</div>

				<div className={`etc-summary__card ${summary.errorsCount > 0 ? 'is-error' : 'is-ok'}`}>
					<span>Validación</span>
					<strong>{summary.errorsCount > 0 ? `${summary.errorsCount} errores` : 'OK'}</strong>
				</div>
			</div>

			{/* =========================
			    TABLE
			========================= */}
			<EtcTable baselineEntries={baselineEntries} showBaseline={showBaseline} />

			{/* =========================
			    EDIT MODAL
			========================= */}
			{showEditModal && (
				<div className="etc-edit-modal__overlay" onClick={() => setShowEditModal(false)}>
					<div className="etc-edit-modal" onClick={(e) => e.stopPropagation()}>
						<div className="etc-edit-modal__header">
							<h3>¿Qué deseas editar?</h3>

							<button className="etc-edit-modal__close" onClick={() => setShowEditModal(false)}>
								<span className="material-icons">close</span>
							</button>
						</div>

						<div className="etc-edit-modal__options">
							<button className="etc-edit-modal__option" onClick={handleEditBaseline}>
								<span className="material-icons">anchor</span>
								<span className="etc-edit-modal__option-label">Línea Base</span>
								<span className="etc-edit-modal__option-sub">Versión fundacional del proyecto</span>
							</button>

							<button className="etc-edit-modal__option" onClick={handleEditWeekly}>
								<span className="material-icons">edit_calendar</span>
								<span className="etc-edit-modal__option-label">{snapshot?.label}</span>
								<span className="etc-edit-modal__option-sub">Último snapshot semanal</span>
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
