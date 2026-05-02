import { FC, MouseEventHandler } from 'react'

interface Props {
	onClick: MouseEventHandler<HTMLButtonElement>
	tooltip?: string
	ariaLabel?: string
	disabled?: boolean
}

/**
 * Botón genérico de "refrescar" — un cuadrado con ícono que rota en hover.
 * Pensado para listados que tienen su propio mecanismo de refetch.
 *
 * Uso:
 *   <RefreshButton onClick={handleRefresh} tooltip="Actualizar lista" />
 */
export const RefreshButton: FC<Props> = ({ onClick, tooltip, ariaLabel, disabled = false }) => (
	<button
		type="button"
		className="refresh-btn"
		onClick={onClick}
		disabled={disabled}
		data-tooltip={tooltip}
		aria-label={ariaLabel ?? tooltip ?? 'Actualizar'}
	>
		<span className="material-icons">refresh</span>
	</button>
)

export default RefreshButton
