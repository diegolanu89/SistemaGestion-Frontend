import { Outlet, Route } from 'react-router-dom'
import { PROYECT_PATHS_VIEWS } from './paths'
import ProyectView from '../views/ProyectView.v'
import { ProyectViewItem } from '../views/ProyectViewItem.v'
import { ProyectViewProvider } from '../context/ProyectView.Context'
import ProtectedRoute from '../../base/components/redirect/ProtectedRoute'

export const ProyectViewPublicRoutes = () => (
	<>
		<Route element={<ProtectedRoute redirectTo="/" permission="PROJECTS_ACCESS" />}>
			<Route
				element={
					<ProyectViewProvider>
						<Outlet />
					</ProyectViewProvider>
				}
			>
				<Route path={PROYECT_PATHS_VIEWS.PROYECT_VIEW} element={<ProyectView />} />

				<Route path={PROYECT_PATHS_VIEWS.PROYECT_ITEM} element={<ProyectViewItem />} />
			</Route>
		</Route>
	</>
)
