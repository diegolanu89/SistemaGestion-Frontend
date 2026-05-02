// components/EtcSummary.tsx

import { FC, useMemo } from 'react'
import { useEtcContext } from '../hooks/useEtcContext.h'

export const EtcSummary: FC = () => {
	const { entries, errors } = useEtcContext()

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

	return (
		<div className="etc-summary">
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
	)
}
