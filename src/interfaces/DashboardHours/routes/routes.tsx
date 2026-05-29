import { Route } from 'react-router-dom'

import { DASHBOARD_HOURS_PATHS } from './paths'

import ProtectedRoute from '../../base/components/redirect/ProtectedRoute'

import { DashboardHoursProvider } from '../context/DashboardHours.Context'

import DashboardHours from '../views/DashboardHours.v'

export const DashBoardHoursRoutes = () => (
	<>
		<Route element={<ProtectedRoute redirectTo="/" permission="DASHBOARD_HOURS_ACCESS" />}>
			<Route
				path={DASHBOARD_HOURS_PATHS.DASHBOARD_HOURS}
				element={
					<DashboardHoursProvider>
						<DashboardHours />
					</DashboardHoursProvider>
				}
			/>
		</Route>
	</>
)
