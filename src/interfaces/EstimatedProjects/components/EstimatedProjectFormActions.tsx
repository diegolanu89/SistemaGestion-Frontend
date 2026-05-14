import { FC } from 'react'
import { ESTIMATED_PROJECT_CONFIG } from '../models/EstimatedProjectConfig.m'

interface Props {
	canSubmit: boolean
	submitting: boolean
	onCancel: () => void
}

export const EstimatedProjectFormActions: FC<Props> = ({ canSubmit, submitting, onCancel }) => {
	const { FORM } = ESTIMATED_PROJECT_CONFIG

	return (
		<footer className="estimated-project-form__actions">
			<button type="button" className="estimated-project-form__btn estimated-project-form__btn--cancel" onClick={onCancel}>
				{FORM.ACTIONS.CANCEL.LABEL}
			</button>

			<button type="submit" className="estimated-project-form__btn estimated-project-form__btn--confirm" disabled={!canSubmit || submitting}>
				{submitting ? 'Guardando…' : FORM.ACTIONS.CONFIRM.LABEL}
			</button>
		</footer>
	)
}
