import { Route } from 'react-router-dom'

import ProtectedRoute from '../../base/components/redirect/ProtectedRoute'

import { REPORTS_PATHS } from './paths'

import Reports from '../views/Report.v'

import { ReportsProvider } from '../context/Report.context'
import DotationReport from '../views/DotacionReport.v'
import ExportReport from '../views/ExportReport.v'

export const ReportsPublicRoutes = () => (
	<>
		<Route element={<ProtectedRoute redirectTo="/" permission="REPORTS_ACCESS" />}>
			<Route
				path={REPORTS_PATHS.REPORTS}
				element={
					<ReportsProvider>
						<Reports />
					</ReportsProvider>
				}
			/>

			<Route
				path={REPORTS_PATHS.DOTATION}
				element={
					<ReportsProvider>
						<DotationReport />
					</ReportsProvider>
				}
			/>

			<Route
				path={REPORTS_PATHS.EXPORT}
				element={
					<ReportsProvider>
						<ExportReport />
					</ReportsProvider>
				}
			/>
		</Route>
	</>
)
