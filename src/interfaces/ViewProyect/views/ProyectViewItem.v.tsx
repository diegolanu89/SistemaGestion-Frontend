import { FC, useEffect, useState } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { useProyectViewContext } from '../hooks/useProyectViewContext.h'
import { proyectViewAdapter } from '../services/ProyectViewAdapter.s'
import { etcAdapter } from '../../Etc/service/EtcAdapter'
import type { ProjectDto } from '../models/ProyectViewDTO.m'

import { ProyectViewItemHeader } from '../components/ProyectViewItemHeader'
import { ProyectViewItemMetrics } from '../components/ProyectViewItemMetric'
import { ProyectViewItemAccordions } from '../components/ProyectViewItemAccordions'

export const ProyectViewItem: FC = () => {
	const { id } = useParams()
	const { projects, loading: listLoading, error: listError } = useProyectViewContext()

	const fromContext = projects.find((p) => String(p.id) === id)

	const [fetched, setFetched] = useState<ProjectDto | null>(null)
	const [itemLoading, setItemLoading] = useState(!fromContext)
	const [itemError, setItemError] = useState<string | null>(null)

	const [etcHours, setEtcHours] = useState(0)

	useEffect(() => {
		if (!id || fromContext) {
			setFetched(null)
			setItemError(null)
			if (fromContext) setItemLoading(false)
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

	useEffect(() => {
		const projectId = Number(id)
		if (!projectId) return

		let cancelled = false

		etcAdapter
			.getByProject(projectId)
			.then((res) => {
				if (!cancelled) {
					const total = res.records.reduce((acc, r) => acc + Number(r.hours), 0)
					setEtcHours(total)
				}
			})
			.catch(() => {})

		return () => {
			cancelled = true
		}
	}, [id])

	const project = fromContext ?? fetched
	const error = listError || itemError

	if (itemLoading && !project) return <div className="empty">Cargando proyecto...</div>
	if (error) return <div className="empty">{error}</div>
	if (!project) return <div className="empty">Proyecto no encontrado</div>

	return (
		<div className="project-item">
			<ProyectViewItemHeader project={project} />
			<ProyectViewItemMetrics project={project} etcHours={etcHours} />
			<ProyectViewItemAccordions project={project} />
			<Outlet />
		</div>
	)
}

export default ProyectViewItem
