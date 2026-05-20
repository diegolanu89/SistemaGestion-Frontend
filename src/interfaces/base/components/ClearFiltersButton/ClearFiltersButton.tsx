import { FC } from 'react'

interface Props {
	onClear: () => void
	active: boolean
	tooltip?: string
}

export const ClearFiltersButton: FC<Props> = ({ onClear, active, tooltip = 'Limpiar filtros' }) => (
	<button
		type="button"
		className={`clear-filters-btn${active ? ' clear-filters-btn--active' : ''}`}
		onClick={onClear}
		data-tooltip={tooltip}
		aria-label={tooltip}
	>
		<span className="material-icons">filter_list_off</span>
	</button>
)

export default ClearFiltersButton
