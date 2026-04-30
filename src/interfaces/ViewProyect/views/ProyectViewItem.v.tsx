import { FC } from 'react'
import { useParams } from 'react-router-dom'
import { useProyectViewContext } from '../hooks/useProyectViewContext.h'

import { ProyectViewItemHeader } from '../components/ProyectViewItemHeader'
import { ProyectViewItemMetrics } from '../components/ProyectViewItemMetric'
import { ProyectViewItemAccordions } from '../components/ProyectViewItemAccordions'

export const ProyectViewItem: FC = () => {
	const { id } = useParams()
	const { projects, loading, error } = useProyectViewContext()

	const project = projects.find((p) => String(p.id) === id)

	if (loading) return <div className="empty">Cargando proyecto...</div>
	if (error) return <div className="empty">{error}</div>
	if (!project) return <div className="empty">Proyecto no encontrado</div>

	return (
		<div className="project-item">
			<ProyectViewItemHeader project={project} />
			<ProyectViewItemMetrics project={project} />
			<ProyectViewItemAccordions project={project} />
		</div>
	)
}

export default ProyectViewItem
