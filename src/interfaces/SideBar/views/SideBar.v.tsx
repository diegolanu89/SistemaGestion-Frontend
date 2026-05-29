import { FC } from 'react'

import { useSideBar } from '../hooks/useSideBar.h'

import { SideBarItem } from '../components/SideBarItem'

import { SIDEBAR } from '../models/SideBarConfig.m'

import { useAuth } from '../../Login/hooks/useAuth.h'

import { PermissionController } from '../../base/controllers/PermissionController.c'

import bdtLogo from '../../../images/brandt/bdt.png'

export const SideBarView: FC = () => {
	const { open, toggle, isOpen, toggleSidebar } = useSideBar()

	const { user } = useAuth()

	if (!user) return null

	return (
		<>
			<button className="sidebar-hamburger" onClick={toggleSidebar}>
				<span className="material-icons">menu</span>
			</button>

			<aside className={`sidebar ${isOpen ? 'is-open' : ''}`}>
				{SIDEBAR.config.title && (
					<div className="sidebar__header">
						<span className="sidebar__title">{SIDEBAR.config.title}</span>
					</div>
				)}

				<nav className="sidebar__menu">
					{SIDEBAR.menu.map((item) => {
						if (!item.children) {
							const allowed = PermissionController.hasPermission(user, item.requiredPermission)

							if (!allowed) {
								return null
							}

							return (
								<div key={item.label} className="sidebar__section" title={item.label}>
									<SideBarItem label={item.label} icon={item.icon} path={item.path} />
								</div>
							)
						}

						const visibleChildren = item.children.filter((child) => PermissionController.hasPermission(user, child.requiredPermission))

						if (visibleChildren.length === 0) {
							return null
						}

						return (
							<div key={item.label} className="sidebar__section">
								<button className="sidebar__parent" onClick={() => toggle(item.label)} title={item.label}>
									<div className="sidebar__parent-left">
										<span className="material-icons">{item.icon}</span>

										<span>{item.label}</span>
									</div>

									<span className="material-icons">{open[item.label] ? 'expand_less' : 'expand_more'}</span>
								</button>

								<div className={`sidebar__children ${open[item.label] ? 'is-open' : ''}`}>
									{visibleChildren.map((child) => (
										<div key={child.label} title={child.label}>
											<SideBarItem label={child.label} icon={child.icon} path={child.path} />
										</div>
									))}
								</div>
							</div>
						)
					})}
				</nav>

				<div className="sidebar__footer-logo">
					<img src={bdtLogo} alt="BDT Logo" />
				</div>
			</aside>
		</>
	)
}

export default SideBarView
