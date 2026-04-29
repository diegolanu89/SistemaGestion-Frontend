import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

interface Props {
	label: string
	icon?: string
	path?: string
	selected?: boolean
}

export const SideBarItem: FC<Props> = ({ label, icon, path, selected = false }) => {
	const navigate = useNavigate()

	const handleClick = () => {
		if (path) navigate(path)
	}

	return (
		<button className={`sidebar-item ${selected ? 'is-selected' : ''}`} onClick={handleClick} type="button">
			{icon && <span className="material-icons sidebar-item__icon">{icon}</span>}

			<span className="sidebar-item__text">{label}</span>
		</button>
	)
}
