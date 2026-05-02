import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { ESTIMATED_PROJECT_CONFIG } from '../models/EstimatedProjectConfig.m'
import { ESTIMATED_PROJECT_PATHS } from '../routes/paths'
import { useEstimatedProjectContext } from '../hooks/useEstimatedProjectContext.h'
import { removeCache } from '../utils/getCache'
import { RefreshButton } from '../../base/components/RefreshButton/RefreshButton'

export const EstimatedProjectHeader: FC = () => {
	const navigate = useNavigate()
	const { refetch } = useEstimatedProjectContext()
	const { TEXTS, ACTIONS, CACHE } = ESTIMATED_PROJECT_CONFIG

	const handleRefresh = async () => {
		removeCache(CACHE.KEYS.PROJECTS)
		removeCache(CACHE.KEYS.REFS)
		await refetch()
	}

	return (
		<header className="estimated-project__header">
			<div className="estimated-project__header-left">
				<h1 className="estimated-project__title">{TEXTS.TITLE}</h1>
				<p className="estimated-project__description">{TEXTS.DESCRIPTION}</p>
			</div>

			<div className="estimated-project__header-actions">
				<RefreshButton onClick={handleRefresh} tooltip={ACTIONS.REFRESH_TOOLTIP} />

				<button
					className="estimated-project__add-btn"
					onClick={() => navigate(ESTIMATED_PROJECT_PATHS.CREATE)}
					data-tooltip={ACTIONS.ADD_TOOLTIP}
				>
					<span className="material-icons">{ACTIONS.ADD_ICON}</span>
					<span>{ACTIONS.ADD_LABEL}</span>
				</button>
			</div>
		</header>
	)
}
