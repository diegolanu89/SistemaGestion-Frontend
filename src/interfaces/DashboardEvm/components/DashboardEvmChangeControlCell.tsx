import { FC } from 'react'

interface Props {
	count: number
	onOpen: () => void
}

export const DashboardEvmChangeControlCell: FC<Props> = ({ count, onOpen }) => {
	const safeCount = typeof count === 'number' && Number.isFinite(count) ? count : 0

	if (safeCount <= 0) {
		return <span className="dashboard-evm-cc dashboard-evm-cc--none">No</span>
	}

	return (
		<button type="button" className="dashboard-evm-cc dashboard-evm-cc--has" onClick={onOpen} data-tooltip="Ver historial de cambios">
			Sí ({safeCount})
		</button>
	)
}
