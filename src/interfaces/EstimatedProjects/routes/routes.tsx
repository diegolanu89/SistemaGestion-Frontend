import { Route } from 'react-router-dom'
import { EstimatedProject, EstimatedProjectCreate } from '..'
import { EstimatedProjectProvider } from '../context/EstimatedProject.Context'
import { ESTIMATED_PROJECT_PATHS } from './paths'

export const EstimatedProjectRoutes = () => (
	<>
		<Route
			path={ESTIMATED_PROJECT_PATHS.LIST}
			element={
				<EstimatedProjectProvider>
					<EstimatedProject />
				</EstimatedProjectProvider>
			}
		/>
		<Route
			path={ESTIMATED_PROJECT_PATHS.CREATE}
			element={
				<EstimatedProjectProvider>
					<EstimatedProjectCreate />
				</EstimatedProjectProvider>
			}
		/>
		<Route
			path={ESTIMATED_PROJECT_PATHS.EDIT}
			element={
				<EstimatedProjectProvider>
					<EstimatedProjectCreate />
				</EstimatedProjectProvider>
			}
		/>
	</>
)
