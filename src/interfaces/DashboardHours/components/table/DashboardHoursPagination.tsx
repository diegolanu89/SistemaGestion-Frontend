import { FC } from 'react'

interface Props {
	page: number

	totalPages: number

	onPrev: () => void

	onNext: () => void
}

export const DashboardHoursPagination: FC<Props> = ({ page, totalPages, onPrev, onNext }) => {
	if (totalPages <= 1) return null

	return (
		<div className="dashboard-hours-table__pagination">
			<button disabled={page <= 1} onClick={onPrev}>
				Anterior
			</button>

			<span>
				Página {page} de {totalPages}
			</span>

			<button disabled={page >= totalPages} onClick={onNext}>
				Siguiente
			</button>
		</div>
	)
}
