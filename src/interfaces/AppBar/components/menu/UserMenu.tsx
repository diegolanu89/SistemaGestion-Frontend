// src/interfaces/AppBar/components/UserMenu.tsx

import { useRef, useEffect } from 'react'
import AvatarImage from '../avatar/AvatarImage'
import { AppBarController } from '../../controllers/AppBarController.c'
import { useAuth } from '../../../Login/hooks/useAuth.h'

interface Props {
	controller: AppBarController
}

export const UserMenu = ({ controller }: Props) => {
	const { user } = useAuth()
	const state = controller.getMenuState()
	const labels = controller.getLabels()

	const menuRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				controller.closeMenu()
			}
		}

		document.addEventListener('click', handleClickOutside)
		return () => document.removeEventListener('click', handleClickOutside)
	}, [controller])

	return (
		<div className="user-menu" ref={menuRef}>
			{/* Avatar Button */}
			<button className="user-menu__trigger" onClick={controller.openMenu} aria-label="Abrir menú usuario">
				<AvatarImage />
			</button>

			{/* Dropdown */}
			{state.anchorEl && (
				<div className="user-menu__dropdown">
					{/* Header */}
					<div className="user-menu__header">
						<AvatarImage />
						<span className="user-menu__name">{user?.name}</span>
					</div>

					<div className="user-menu__divider" />

					{/* Items */}
					<button className="user-menu__item" onClick={controller.goHome}>
						{labels.HOME}
					</button>

					<button className="user-menu__item" onClick={controller.openProfile}>
						{labels.PROFILE}
					</button>

					<div className="user-menu__divider" />

					<button className="user-menu__item user-menu__item--danger" onClick={controller.logout}>
						{labels.LOGOUT}
					</button>
				</div>
			)}
		</div>
	)
}
