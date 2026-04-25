import { Route } from 'react-router-dom'
import { Login } from '..'

import { LOGIN_PATHS } from './paths'

export const LoginPublicRoutes = () => (
	<>
		<Route path={LOGIN_PATHS.LOGIN} element={<Login />} />
	</>
)
