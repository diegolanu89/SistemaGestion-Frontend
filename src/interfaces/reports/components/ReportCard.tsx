import { FC } from 'react'

import { useNavigate } from 'react-router-dom'
import { REPORTS_CONFIG } from '../models/ReportConfig.m'

const ReportsCards: FC = () => {
	const navigate = useNavigate()

	return (
		<div className="reports-cards">
			{REPORTS_CONFIG.cards.map((card) => (
				<div key={card.id} className="report-card" onClick={() => navigate(card.path)}>
					<div className="report-card__icon">
						<span className="material-icons">{card.icon}</span>
					</div>

					<div className="report-card__content">
						<h2>{card.title}</h2>

						<p>{card.description}</p>
					</div>

					<div className="report-card__action">
						<span className="material-icons">arrow_forward</span>
					</div>
				</div>
			))}
		</div>
	)
}

export default ReportsCards
