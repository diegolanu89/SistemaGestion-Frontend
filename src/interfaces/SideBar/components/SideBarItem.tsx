import { FC } from 'react'

interface Props {
	label: string
	icon?: string
	onClick?: () => void
	selected?: boolean
}

export const SideBarItem: FC<Props> = ({ label, icon, onClick, selected = false }) => {
	return (
		<button className={`sidebar-item ${selected ? 'is-selected' : ''}`} onClick={onClick} type="button">
			{icon && <span className="material-icons sidebar-item__icon">{icon}</span>}

			<span className="sidebar-item__text">{label}</span>
		</button>
	)
}
