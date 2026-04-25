// src/interfaces/AppBar/components/NavigatorButton.tsx

import { useLocation, useNavigate } from 'react-router-dom'
import { AppBarController } from '../../controllers/AppBarController.c'
import { AppBar } from '../../models/AppBar.m'

const controller = new AppBarController(AppBar)

export const NavigatorButton = () => {
	const location = useLocation()
	const navigate = useNavigate()

	const shouldShowBackButton = controller.shouldShowBackButton(location.pathname)
	const title = controller.getTitle(location.pathname)

	return (
		<div className="navigator">
			{shouldShowBackButton && (
				<button className="navigator__back" onClick={() => navigate(-1)} aria-label="Volver">
					<span className="material-icons">arrow_back</span>
				</button>
			)}

			<span className="navigator__title">{title}</span>
		</div>
	)
}
