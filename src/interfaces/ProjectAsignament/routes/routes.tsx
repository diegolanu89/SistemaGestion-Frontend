import { Route } from 'react-router-dom'
import { PROJECT_ASSIGNMENT_PATHS } from './paths'
import ProtectedRoute from '../../base/components/redirect/ProtectedRoute'
import { ProjectAssignmentProvider } from '../context/ProjectAsignment.Context'
import ProjectAssignment from '../views/ProjectAsignament.v'

export const ProjectAssignmentRoutes = () => (
	<>
		<Route element={<ProtectedRoute redirectTo="/" permission="PROJECTS_ASSIGN" />}>
			<Route
				path={PROJECT_ASSIGNMENT_PATHS.PROJECT_ASSIGNMENT}
				element={
					<ProjectAssignmentProvider>
						<ProjectAssignment />
					</ProjectAssignmentProvider>
				}
			/>
		</Route>
	</>
)
