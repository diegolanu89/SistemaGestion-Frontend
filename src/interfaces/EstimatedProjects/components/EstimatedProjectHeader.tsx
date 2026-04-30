import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { ESTIMATED_PROJECT_CONFIG } from '../models/EstimatedProjectConfig.m'
import { ESTIMATED_PROJECT_PATHS } from '../routes/paths'

export const EstimatedProjectHeader: FC = () => {
	const navigate = useNavigate()
	const { TEXTS, ACTIONS } = ESTIMATED_PROJECT_CONFIG

	return (
		<header className="estimated-project__header">
			<div className="estimated-project__header-left">
				<h1 className="estimated-project__title">{TEXTS.TITLE}</h1>
				<p className="estimated-project__description">{TEXTS.DESCRIPTION}</p>
			</div>

			<button
				className="estimated-project__add-btn"
				onClick={() => navigate(ESTIMATED_PROJECT_PATHS.CREATE)}
				data-tooltip={ACTIONS.ADD_TOOLTIP}
			>
				<span className="material-icons">{ACTIONS.ADD_ICON}</span>
				<span>{ACTIONS.ADD_LABEL}</span>
			</button>
		</header>
	)
}
