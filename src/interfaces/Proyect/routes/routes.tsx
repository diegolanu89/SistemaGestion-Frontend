import { Route } from 'react-router-dom'

import { Proyect } from '..'

import { ProyectProvider } from '../context/Proyect.Context'

import { PROYECT_PATHS } from './paths'

import ProtectedRoute from '../../base/components/redirect/ProtectedRoute'

export const ProyectPublicRoutes = () => (
	<>
		<Route element={<ProtectedRoute redirectTo="/" permission="PROJECTS_CREATE" />}>
			<Route
				path={PROYECT_PATHS.PROYECT}
				element={
					<ProyectProvider>
						<Proyect />
					</ProyectProvider>
				}
			/>
		</Route>
	</>
)
