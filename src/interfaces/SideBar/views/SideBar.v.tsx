import { FC } from 'react'
import { matchPath, useLocation } from 'react-router-dom'

import { useSideBar } from '../hooks/useSideBar.h'

import { SideBarItem } from '../components/SideBarItem'

import { SIDEBAR } from '../models/SideBarConfig.m'
import { SideBarItem as SideBarItemType } from '../models/SideBar.m'

import { useAuth } from '../../Login/hooks/useAuth.h'

import { PermissionController } from '../../base/controllers/PermissionController.c'

import bdtLogo from '../../../images/brandt/bdt.png'

const normalizePath = (path: string): string => {
	if (path === '/') return path

	return path.replace(/\/+$/, '')
}

const isActivePath = (pathname: string, path: string): boolean => {
	const currentPath = normalizePath(pathname)
	const targetPath = normalizePath(path)

	if (targetPath === '/') {
		return currentPath === '/'
	}

	return Boolean(matchPath({ path: targetPath, end: false }, currentPath))
}

const isItemActive = (item: SideBarItemType, pathname: string): boolean => {
	const paths = [item.path, ...(item.activePaths ?? [])].filter((path): path is string => Boolean(path))

	return paths.some((path) => isActivePath(pathname, path))
}

export const SideBarView: FC = () => {
	const { open, toggle, isOpen, toggleSidebar } = useSideBar()
	const location = useLocation()

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
									<SideBarItem label={item.label} icon={item.icon} path={item.path} selected={isItemActive(item, location.pathname)} />
								</div>
							)
						}

						const visibleChildren = item.children.filter((child) => PermissionController.hasPermission(user, child.requiredPermission))
						const hasActiveChild = visibleChildren.some((child) => isItemActive(child, location.pathname))
						const expanded = Boolean(open[item.label] || hasActiveChild)

						if (visibleChildren.length === 0) {
							return null
						}

						return (
							<div key={item.label} className="sidebar__section">
								<button className={`sidebar__parent ${hasActiveChild ? 'is-selected' : ''}`} onClick={() => toggle(item.label)} title={item.label} aria-expanded={expanded}>
									<div className="sidebar__parent-left">
										<span className="material-icons">{item.icon}</span>

										<span>{item.label}</span>
									</div>

									<span className="material-icons">{expanded ? 'expand_less' : 'expand_more'}</span>
								</button>

								<div className={`sidebar__children ${expanded ? 'is-open' : ''}`}>
									{visibleChildren.map((child) => (
										<div key={child.label} title={child.label}>
											<SideBarItem label={child.label} icon={child.icon} path={child.path} selected={isItemActive(child, location.pathname)} />
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
