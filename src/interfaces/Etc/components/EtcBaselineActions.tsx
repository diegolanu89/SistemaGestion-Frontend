// components/EtcBaselineActions.tsx

import { FC } from 'react'

import { useEtcWeeklyVersionController } from '../hooks/useEtcWeelyVersionController.h'

export const EtcBaselineActions: FC = () => {
	const { loading, handleBack, finalizeBaseline, errors } = useEtcWeeklyVersionController()

	return (
		<div className="etc-weekly-actions-wrapper">
			{errors.length > 0 && (
				<ul className="etc-weekly-actions__errors">
					{errors.map((err, i) => (
						<li key={i} className="etc-weekly-actions__error-item">
							{err.message}
						</li>
					))}
				</ul>
			)}

			<footer className="etc-weekly-actions">
				<button type="button" className="etc-weekly-actions__cancel" onClick={handleBack}>
					Cancelar
				</button>

				<button type="button" className="etc-weekly-actions__save" onClick={() => void finalizeBaseline()} disabled={loading}>
					{loading ? 'Guardando...' : 'Grabar línea base'}
				</button>
			</footer>
		</div>
	)
}
