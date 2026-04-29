// components/ProyectHeader.tsx
import { FC } from 'react'
import { PROYECT_CONFIG } from '../models/ProyectConfig.m'

interface Props {
	onAdd: () => void
}

export const ProyectHeader: FC<Props> = ({ onAdd }) => {
	return (
		<header className="proyect__header">
			<div className="proyect__header-left">
				<h1 className="proyect__title">{PROYECT_CONFIG.TEXTS.TITLE}</h1>

				<p className="proyect__description">{PROYECT_CONFIG.TEXTS.DESCRIPTION}</p>
			</div>

			<button className="proyect__add-btn" onClick={onAdd} data-tooltip={PROYECT_CONFIG.ACTIONS.ADD_TOOLTIP}>
				<span className="material-icons">{PROYECT_CONFIG.ACTIONS.ADD_ICON}</span>

				<span>{PROYECT_CONFIG.ACTIONS.ADD_LABEL}</span>
			</button>
		</header>
	)
}
