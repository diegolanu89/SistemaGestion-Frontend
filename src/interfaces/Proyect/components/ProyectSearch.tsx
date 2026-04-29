// components/ProyectSearch.tsx
import { FC, useEffect, useState } from 'react'
import { useProyectContext } from '../hooks/useProyectContext.h'
import { PROYECT_CONFIG } from '../models/ProyectConfig.m'

export const ProyectSearch: FC = () => {
	const { search, setSearch } = useProyectContext()

	const [localValue, setLocalValue] = useState(search)

	useEffect(() => {
		setLocalValue(search)
	}, [search])

	useEffect(() => {
		const timer = setTimeout(() => {
			setSearch(localValue)
		}, PROYECT_CONFIG.SEARCH.DEBOUNCE_MS)

		return () => clearTimeout(timer)
	}, [localValue, setSearch])

	return (
		<div className="proyect-search">
			<label className="proyect-search__label">{PROYECT_CONFIG.TEXTS.SEARCH_LABEL}</label>

			<div className="proyect-search__control">
				<span className="material-icons proyect-search__icon">{PROYECT_CONFIG.ICONS.SEARCH}</span>

				<input
					className="proyect-search__input"
					type="text"
					placeholder={PROYECT_CONFIG.TEXTS.SEARCH_PLACEHOLDER}
					value={localValue}
					onChange={(e) => setLocalValue(e.target.value)}
				/>
			</div>
		</div>
	)
}
