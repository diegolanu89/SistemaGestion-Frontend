import { Outlet, Route } from 'react-router-dom'
import { PROYECT_PATHS_VIEWS } from './paths'
import ProyectView from '../views/ProyectView.v'
import { ProyectViewItem } from '../views/ProyectViewItem.v'
import { ProyectViewProvider } from '../context/ProyectView.Context'
import { EtcLoadView } from '../../Etc/views/EtcLoadView.v'
import { EtcProvider } from '../../Etc/context/Etc.Context'
import EtcWeeklyVersionView from '../../Etc/views/EtcWeeklyVersionView.v'
import ProtectedRoute from '../../base/components/redirect/ProtectedRoute'

export const ProyectViewPublicRoutes = () => (
	<>
		{/* ==========================
		    🔹 PROJECTS ACCESS
		========================== */}

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

		{/* ==========================
		    🔹 ETC ACCESS
		========================== */}

		<Route element={<ProtectedRoute redirectTo="/" permission="ETC_ACCESS" />}>
			<Route
				element={
					<EtcProvider>
						<Outlet />
					</EtcProvider>
				}
			>
				<Route path={PROYECT_PATHS_VIEWS.ETC_LOAD} element={<EtcLoadView />} />

				<Route path={PROYECT_PATHS_VIEWS.ETC_WEEKLY_VERSION} element={<EtcWeeklyVersionView />} />
			</Route>
		</Route>
	</>
)
