// components/EtcWeeklyVersionHeader.tsx

import { FC } from 'react'

import { useEtcWeeklyVersionController } from '../hooks/useEtcWeelyVersionController.h'

export const EtcWeeklyVersionHeader: FC = () => {
	const { projectName, handleBack } = useEtcWeeklyVersionController()

	return (
		<header className="etc-weekly-header">
			<button type="button" className="etc-weekly-header__back" onClick={handleBack}>
				<span className="material-icons">arrow_back</span>
			</button>

			<div>
				<h1 className="etc-weekly-header__title">Nueva versión semanal</h1>

				<p className="etc-weekly-header__subtitle">
					Actualización de forecast ETC para el proyecto:
					<strong> {projectName}</strong>
				</p>
			</div>
		</header>
	)
}
