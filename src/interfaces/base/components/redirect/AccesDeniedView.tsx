import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

interface Props {
	requiredPermission?: string
}

export const AccessDeniedView: FC<Props> = ({ requiredPermission }) => {
	const navigate = useNavigate()

	return (
		<div className="access-denied">
			<div className="access-denied__card">
				<span className="material-icons access-denied__icon">lock</span>

				<h1>403</h1>

				<h2>Acceso denegado</h2>

				<p>No posee permisos suficientes para acceder a esta funcionalidad.</p>

				{requiredPermission && (
					<div className="access-denied__permission">
						<span>Permiso requerido:</span>

						<strong>{requiredPermission}</strong>
					</div>
				)}

				<button type="button" onClick={() => navigate('/')}>
					Volver al inicio
				</button>
			</div>
		</div>
	)
}

export default AccessDeniedView
