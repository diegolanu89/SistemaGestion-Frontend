import { useNavigate } from 'react-router-dom'
import { Feature } from '../models/Feature.m'
import { useCapabilities } from '../../base/context/Capabilities.Context'

const FeatureGrid = () => {
	const navigate = useNavigate()
	const { role } = useCapabilities()
	const config = Feature.GRID

	const actions = config.ACTIONS.filter((a) => a.roles.includes(role))

	return (
		<section className="feature-grid">
			{/* HEADER */}
			<div className="feature-grid__header">
				<div className="feature-grid__icon">
					<img src={config.HEADER.ICON} alt={config.HEADER.ICON_ALT} className="feature-grid__icon-img" />
				</div>

				<h2 className="feature-grid__title">{config.HEADER.TITLE}</h2>

				<p className="feature-grid__description">{config.HEADER.DESCRIPTION}</p>
			</div>

			{/* BOTONERA */}
			<div
				className="feature-grid__container"
				style={{
					gap: config.LAYOUT.GAP,
					maxWidth: config.LAYOUT.MAX_WIDTH,
					paddingTop: config.LAYOUT.PADDING_Y,
				}}
			>
				{actions.map((action) => (
					<button key={action.id} className="feature-grid__button" onClick={() => navigate(action.route)}>
						<img src={action.icon} alt={action.label} className="feature-grid__button-icon" />
						<span>{action.label}</span>
					</button>
				))}
			</div>
		</section>
	)
}

export default FeatureGrid
