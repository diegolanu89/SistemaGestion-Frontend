import { Route } from 'react-router-dom'
import ProtectedRoute from '../../base/components/redirect/ProtectedRoute'
import ConfigurationsView from '../views/Configurations.v'
import { CONFIGURATIONS_PATHS } from './paths'

export const ConfigurationsRoutes = () => (
	<Route element={<ProtectedRoute redirectTo="/" permission="SETTINGS_ACCESS" />}>
		<Route path={CONFIGURATIONS_PATHS.LIST} element={<ConfigurationsView />} />
	</Route>
)
