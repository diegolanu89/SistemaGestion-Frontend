import { Route } from 'react-router-dom'
import { Proyect } from '..'
import { ProyectProvider } from '../context/Proyect.Context'

import { PROYECT_PATHS } from './paths'

export const ProyectPublicRoutes = () => (
	<>
		<Route
			path={PROYECT_PATHS.PROYECT}
			element={
				<ProyectProvider>
					<Proyect />
				</ProyectProvider>
			}
		/>
	</>
)
