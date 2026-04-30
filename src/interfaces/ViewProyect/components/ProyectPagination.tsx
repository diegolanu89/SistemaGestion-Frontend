import { FC } from 'react'
import { useProyectViewController } from '../hooks/useProyectViewController.h'

export const ProyectPagination: FC = () => {
	const { page, setPage, totalPages } = useProyectViewController()

	if (totalPages <= 1) return null

	return (
		<div className="pagination">
			<button disabled={page === 1} onClick={() => setPage(1)}>
				{'<<'}
			</button>

			<button disabled={page === 1} onClick={() => setPage(page - 1)}>
				{'<'}
			</button>

			<span>
				Página {page} de {totalPages}
			</span>

			<button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
				{'>'}
			</button>

			<button disabled={page === totalPages} onClick={() => setPage(totalPages)}>
				{'>>'}
			</button>
		</div>
	)
}
