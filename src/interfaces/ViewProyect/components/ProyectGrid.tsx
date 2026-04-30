import { FC, useMemo } from 'react'
import { useProyectViewContext } from '../hooks/useProyectViewContext.h'

export const ProyectGrid: FC = () => {
	const { projects, filters, loading, error } = useProyectViewContext()

	const filteredProjects = useMemo(() => {
		return projects.filter((p) => {
			const matchesSearch = p.name.toLowerCase().includes(filters.search.toLowerCase())
			const matchesClient = filters.client === 'all' || p.clientName === filters.client
			const matchesStatus = filters.status === 'all' || p.status === filters.status
			const matchesCode = filters.code === 'all' || p.code === filters.code

			return matchesSearch && matchesClient && matchesStatus && matchesCode
		})
	}, [projects, filters])

	if (!loading && !error && filteredProjects.length === 0) {
		return <div className="empty">No hay proyectos disponibles</div>
	}

	return (
		<div className="grid">
			{filteredProjects.map((p) => (
				<div className="card" key={p.id}>
					<span className="card__status">{p.status}</span>

					<h3>{p.name}</h3>

					<p>
						<strong>Cliente:</strong> {p.clientName ?? '-'}
					</p>

					<p>
						<strong>Código:</strong> {p.code ?? '-'}
					</p>

					<p>
						<strong>BAC HS:</strong> {p.bacTotalHours}
					</p>

					<p>
						<strong>BAC $:</strong> {p.bacTotalCost}
					</p>
				</div>
			))}
		</div>
	)
}
