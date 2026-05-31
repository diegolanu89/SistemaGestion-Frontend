import { Route } from 'react-router-dom'
import ProtectedRoute from '../../base/components/redirect/ProtectedRoute'
import { REPORTS_PATHS } from './paths'
import { ReportsProvider } from '../context/Report.context'
import DotationReport from '../views/DotacionReport.v'

export const ReportsPublicRoutes = () => (
	<>
		<Route element={<ProtectedRoute redirectTo="/" permission="REPORTS_ACCESS" />}>
			<Route
				path={REPORTS_PATHS.DOTATION}
				element={
					<ReportsProvider>
						<DotationReport />
					</ReportsProvider>
				}
			/>
		</Route>
	</>
)
