// components/EtcWeeklyVersionHeader.tsx

import { FC } from 'react'

interface Props {
	projectName: string
	onBack: () => void
}

export const EtcWeeklyVersionHeader: FC<Props> = ({ projectName, onBack }) => {
	return (
		<header className="etc-weekly-header">
			<button type="button" className="etc-weekly-header__back" onClick={onBack}>
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
