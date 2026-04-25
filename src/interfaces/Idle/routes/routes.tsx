import { Route } from 'react-router-dom'
import Idle from '../views/Idle.v'
import { IDLE_PATHS } from './paths'

export const IdleProtectedRoutes = () => <Route path={IDLE_PATHS.HOME} element={<Idle />} />
