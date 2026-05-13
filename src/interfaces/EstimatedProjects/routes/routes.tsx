import { Route } from 'react-router-dom'

import { EstimatedProject, EstimatedProjectCreate, EstimatedProjectEdit } from '..'

import { EstimatedProjectProvider } from '../context/EstimatedProject.Context'

import { ESTIMATED_PROJECT_PATHS } from './paths'

import ProtectedRoute from '../../base/components/redirect/ProtectedRoute'

export const EstimatedProjectRoutes = () => (
	<>
		<Route element={<ProtectedRoute redirectTo="/" permission="ESTIMATED_PROJECTS_ACCESS" />}>
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
						<EstimatedProjectEdit />
					</EstimatedProjectProvider>
				}
			/>
		</Route>
	</>
)
