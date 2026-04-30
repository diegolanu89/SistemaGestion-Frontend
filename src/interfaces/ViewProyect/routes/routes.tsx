import { Route } from 'react-router-dom'
import { PROYECT_PATHS_VIEWS } from './paths'
import { ProyectViewProvider } from '../context/ProyectView.Context'
import ProyectView from '../views/ProyectView.v'

export const ProyectViewPublicRoutes = () => (
	<>
		<Route
			path={PROYECT_PATHS_VIEWS.PROYECT_VIEW}
			element={
				<ProyectViewProvider>
					<ProyectView />
				</ProyectViewProvider>
			}
		/>
	</>
)
