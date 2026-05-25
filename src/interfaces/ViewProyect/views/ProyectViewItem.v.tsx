import { FC, useEffect, useState } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { useProyectViewContext } from '../hooks/useProyectViewContext.h'
import { proyectViewAdapter } from '../services/ProyectViewAdapter.s'
import type { ProjectDto } from '../models/ProyectViewDTO.m'

import { ProyectViewItemHeader } from '../components/ProyectViewItemHeader'
import { ProyectViewItemMetrics } from '../components/ProyectViewItemMetric'
import { ProyectViewItemAccordions } from '../components/ProyectViewItemAccordions'

export const ProyectViewItem: FC = () => {
	const { id } = useParams()
	const { projects, loading: listLoading, error: listError } = useProyectViewContext()

	// El array del context puede estar vacío si entramos por URL directa o
	// si volvimos desde una ruta cubierta por otro provider (ej: Etc), que
	// desmonta ProyectViewProvider. En ese caso, fetcheamos por id.
	const fromContext = projects.find((p) => String(p.id) === id)

	const [fetched, setFetched] = useState<ProjectDto | null>(null)
	const [itemLoading, setItemLoading] = useState(!fromContext)
	const [itemError, setItemError] = useState<string | null>(null)

	useEffect(() => {
		if (!id || fromContext) {
			setFetched(null)
			setItemError(null)
			return
		}

		let cancelled = false
		setItemLoading(true)
		setItemError(null)

		proyectViewAdapter
			.getById(Number(id))
			.then((p) => {
				if (!cancelled) setFetched(p)
			})
			.catch(() => {
				if (!cancelled) setItemError('Proyecto no encontrado')
			})
			.finally(() => {
				if (!cancelled) setItemLoading(false)
			})

		return () => {
			cancelled = true
		}
	}, [id, fromContext])

	const project = fromContext ?? fetched
	const loading = listLoading || itemLoading
	const error = listError || itemError

	if (loading) return <div className="empty">Cargando proyecto...</div>
	if (error) return <div className="empty">{error}</div>
	if (!project) return <div className="empty">Proyecto no encontrado</div>

	return (
		<div className="project-item">
			<ProyectViewItemHeader project={project} />
			<ProyectViewItemMetrics project={project} />
			<ProyectViewItemAccordions project={project} />
			<Outlet />
		</div>
	)
}

export default ProyectViewItem
