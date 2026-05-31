import { Outlet, Route } from 'react-router-dom'

import ProtectedRoute from '../../base/components/redirect/ProtectedRoute'

import { DashboardEvmProvider } from '../context/DashboardEvm.Context'
import DashboardEvmView from '../views/DashboardEvm.v'

import { DASHBOARD_EVM_PATHS } from './paths'

export const DashboardEvmRoutes = () => (
	<Route element={<ProtectedRoute redirectTo="/" permission="DASHBOARD_EVM_ACCESS" />}>
		<Route
			element={
				<DashboardEvmProvider>
					<Outlet />
				</DashboardEvmProvider>
			}
		>
			<Route path={DASHBOARD_EVM_PATHS.DASHBOARD} element={<DashboardEvmView />} />
		</Route>
	</Route>
)
