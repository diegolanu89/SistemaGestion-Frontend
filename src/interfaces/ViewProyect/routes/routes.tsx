// routes/ProyectViewPublicRoutes.tsx

import { Outlet, Route } from 'react-router-dom'
import { PROYECT_PATHS_VIEWS } from './paths'

import ProyectView from '../views/ProyectView.v'
import { ProyectViewItem } from '../views/ProyectViewItem.v'
import { ProyectViewProvider } from '../context/ProyectView.Context'

import { EtcLoadView } from '../../Etc/views/EtcLoadView.v'
import { EtcProvider } from '../../Etc/context/Etc.Context'
import EtcWeeklyVersionView from '../../Etc/views/EtcWeeklyVersionView.v'

export const ProyectViewPublicRoutes = () => (
	<Route
		element={
			<ProyectViewProvider>
				<Outlet />
			</ProyectViewProvider>
		}
	>
		<Route path={PROYECT_PATHS_VIEWS.PROYECT_VIEW} element={<ProyectView />} />

		<Route path={PROYECT_PATHS_VIEWS.PROYECT_ITEM} element={<ProyectViewItem />} />

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
)
