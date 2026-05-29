import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

export const RouteNotFound: FC = () => {
	const navigate = useNavigate()

	return (
		<div className="route-not-found">
			<div className="route-not-found__card">
				<span className="material-icons route-not-found__icon">error_outline</span>

				<h1>404</h1>

				<h2>Ruta no encontrada</h2>

				<p>La dirección solicitada no existe o no se encuentra disponible.</p>

				<button onClick={() => navigate('/')}>Volver al inicio</button>
			</div>
		</div>
	)
}

export default RouteNotFound
