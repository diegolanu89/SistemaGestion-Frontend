import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../Login/hooks/useAuth.h'
import { useModal } from '../../base/hooks/useModal.h'
import { AppBar } from '../models/AppBar.m'
import { AppBarController } from '../controllers/AppBarController.c'
import { UserMenu } from '../components/menu/UserMenu'
import { AppBarSpacer } from '../components/bar/AppBarSpacer'
import { ThemeToggle } from '../components/styleToggle/ThemeToggle'

const controller = new AppBarController(AppBar)

const AppBarHeader = () => {
	const [, setAnchorEl] = useState<HTMLElement | null>(null)

	const { user, logout } = useAuth()
	const { onPerfil } = useModal()
	const navigate = useNavigate()

	controller.bindRuntime({
		setAnchorEl,
		navigate,
		logout,
		onPerfil,
	})

	return (
		<>
			<header className="appbar">
				<div className="appbar__content">
					<div className="appbar__spacer" />

					<ThemeToggle />

					{user && <UserMenu controller={controller} />}
				</div>
			</header>

			<AppBarSpacer />
		</>
	)
}

export default AppBarHeader
