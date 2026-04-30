import './css/appStyle.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { AuthProvider } from './interfaces/Login/context/Login.Context'
import { ModalProvider } from './interfaces/base/context/Modal.Context'
import { CapabilitiesProvider } from './interfaces/base/context/Capabilities.Context'

import AppBarHeader from './interfaces/AppBar/views/AppBar.v'
import ProtectedRoute from './interfaces/base/components/redirect/ProtectedRoute'
import RedirectHome from './interfaces/base/components/redirect/RedirectHome'

import { IdleProtectedRoutes } from './interfaces/Idle/routes/routes'
import { LoginPublicRoutes } from './interfaces/Login/routes/routes'
import { ProyectPublicRoutes } from './interfaces/Proyect/routes/routes'
import { EstimatedProjectRoutes } from './interfaces/EstimatedProjects/routes/routes'

import { IDLE_PATHS } from './interfaces/Idle/routes/paths'
import { LOGIN_PATHS } from './interfaces/Login/routes/paths'

import { SideBarView } from './interfaces/SideBar/views/SideBar.v'

import ThemeContext from './interfaces/base/context/Theme.Context'
import { useAppTheme } from './interfaces/base/hooks/useAppTheme.h'

const AppClient = () => {
	const { toggleTheme, mode } = useAppTheme()

	return (
		<ThemeContext.Provider value={{ toggleTheme, mode }}>
			<div className="app-root">
				<BrowserRouter>
					<AuthProvider home={IDLE_PATHS.HOME}>
						<CapabilitiesProvider>
							<ModalProvider>
								<AppBarHeader />
								<SideBarView />

								<main className="app-content">
									<Routes>
										<Route path="/" element={<RedirectHome authenticatedPath={IDLE_PATHS.HOME} unauthenticatedPath={LOGIN_PATHS.LOGIN} />} />

										{LoginPublicRoutes()}

										<Route element={<ProtectedRoute redirectTo={LOGIN_PATHS.LOGIN} />}>
											{IdleProtectedRoutes()}
											{ProyectPublicRoutes()}
											{EstimatedProjectRoutes()}
										</Route>
									</Routes>
								</main>
							</ModalProvider>
						</CapabilitiesProvider>
					</AuthProvider>
				</BrowserRouter>
			</div>
		</ThemeContext.Provider>
	)
}

export default AppClient
