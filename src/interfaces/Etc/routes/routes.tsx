import { Outlet, Route } from 'react-router-dom'
import ProtectedRoute from '../../base/components/redirect/ProtectedRoute'
import { EtcProvider } from '../context/Etc.Context'
import EtcWeeklyVersionView from '../views/EtcWeeklyVersionView.v'
import EtcBaselineView from '../views/EtcBaselineView.v'
import EtcViewBaselineView from '../views/EtcViewBaselineView.v'
import { ETC_LOAD_PROJECT } from './paths'
import EtcLoadProjectView from '../views/EtcProjectView.v'
import EtcEditSnapshotView from '../views/EtcEditSnapshotView.v'

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

				<Route path={ETC_LOAD_PROJECT.ETC_BASELINE} element={<EtcBaselineView />} />

				<Route path={ETC_LOAD_PROJECT.ETC_VIEW_BASELINE} element={<EtcViewBaselineView />} />

				<Route path={ETC_LOAD_PROJECT.ETC_EDIT_SNAPSHOT} element={<EtcEditSnapshotView />} />
			</Route>
		</Route>
	</>
)
