import { FC } from 'react'
import { ESTIMATED_PROJECT_CONFIG } from '../models/EstimatedProjectConfig.m'

interface Props {
	error: string | null
	onBack: () => void
}

export const EstimatedProjectFormLoadingState: FC<Props> = ({ error, onBack }) => {
	const { FORM } = ESTIMATED_PROJECT_CONFIG

	if (error) {
		return (
			<div className="estimated-project-form">
				<div className="estimated-project-form__errors">{error}</div>

				<button type="button" className="estimated-project-form__btn estimated-project-form__btn--cancel" onClick={onBack}>
					{FORM.ACTIONS.CANCEL.LABEL}
				</button>
			</div>
		)
	}

	return <div className="estimated-project-form__loading">Cargando proyecto…</div>
}
