import { FC } from 'react'
import { useSideBar } from '../hooks/useSideBar.h'
import { SideBarItem } from '../components/SideBarItem'
import { SIDEBAR } from '../models/SideBarConfig.m'
import { useAuth } from '../../Login/hooks/useAuth.h'

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
				<div className="sidebar__header">
					<span className="sidebar__title">{SIDEBAR.config.title}</span>
				</div>

				<nav className="sidebar__menu">
					{SIDEBAR.menu.map((item) => (
						<div key={item.label} className="sidebar__section">
							<button className="sidebar__parent" onClick={() => toggle(item.label)}>
								<span className="material-icons">{item.icon}</span>
								<span>{item.label}</span>
								<span className="material-icons">{open[item.label] ? 'expand_less' : 'expand_more'}</span>
							</button>

							<div className={`sidebar__children ${open[item.label] ? 'is-open' : ''}`}>
								{item.children?.map((child) => (
									<SideBarItem key={child.label} label={child.label} icon={child.icon} path={child.path} />
								))}
							</div>
						</div>
					))}
				</nav>
			</aside>
		</>
	)
}
