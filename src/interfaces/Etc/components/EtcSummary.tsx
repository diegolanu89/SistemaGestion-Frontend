// components/EtcSummary.tsx

import { FC, useMemo } from 'react'
import { useEtcContext } from '../hooks/useEtcContext.h'
import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'
import { EtcTable } from './EtcTable'

export const EtcSummary: FC = () => {
	const { entries, errors } = useEtcContext()

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
	// ACTIONS
	// =========================
	const handleViewBaseline = () => {
		logger.infoTag(LogTag.Navigation, '[ETC] View baseline')
	}

	const handleNewVersion = () => {
		logger.infoTag(LogTag.Adapter, '[ETC] Create weekly snapshot')
	}

	return (
		<div className="etc-summary">
			{/* =========================
			    HEADER
			========================= */}
			<div className="etc-summary__header">
				<div className="etc-summary__titles">
					<h2 className="etc-summary__title">Línea Base</h2>

					<p className="etc-summary__subtitle">
						Visualización y control de versiones semanales de la planificación ETC del proyecto. Permite comparar la evolución y generar snapshots para
						seguimiento.
					</p>
				</div>

				<div className="etc-summary__actions">
					<button className="etc-summary__btn etc-summary__btn--ghost" onClick={handleViewBaseline}>
						<span className="material-icons etc-summary__icon">visibility</span>
						Visualizar línea base
					</button>

					<button className="etc-summary__btn etc-summary__btn--primary" onClick={handleNewVersion}>
						<span className="material-icons etc-summary__icon">add</span>
						Nueva versión semanal
					</button>
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
			<EtcTable />
		</div>
	)
}
