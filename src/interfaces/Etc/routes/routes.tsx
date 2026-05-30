import { Outlet, Route } from 'react-router-dom'
import ProtectedRoute from '../../base/components/redirect/ProtectedRoute'
import { EtcProvider } from '../context/Etc.Context'
import EtcWeeklyVersionView from '../views/EtcWeeklyVersionView.v'
import { ETC_LOAD_PROJECT } from './paths'
import EtcLoadProjectView from '../views/EtcProjectView.v'

export const EtcProyectViewPublicRoutes = () => (
	<>
		<Route element={<ProtectedRoute redirectTo="/" permission="ETC_ACCESS" />}>
			<Route
				element={
					<EtcProvider>
						<Outlet />
					</EtcProvider>
				}
			>
				<Route path={ETC_LOAD_PROJECT.ETC_LOAD} element={<EtcLoadProjectView />} />

				<Route path={ETC_LOAD_PROJECT.ETC_WEEKLY_VERSION} element={<EtcWeeklyVersionView />} />
			</Route>
		</Route>
	</>
)
