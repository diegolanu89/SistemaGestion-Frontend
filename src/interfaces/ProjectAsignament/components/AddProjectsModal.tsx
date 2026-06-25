import { FC, useState, useMemo } from 'react'

import SelectableProjectList from './SelectableProjectList'

import { useProjectAssignment } from '../hooks/useProjectAsignment.h'

import { SectionLoader } from '../../base/components/loading/SectionLoader'
import { ClearFiltersButton } from '../../base/components/ClearFiltersButton/ClearFiltersButton'

import logger from '../../base/controllers/Logger.c'

import { LogTag } from '../../base/model/LogTag.m'

import { visibleProjectsAdapter } from '../services/ProjectAsignamentAdapter.s'

import { VisibleProjectDto } from '../models/VisibleProject.m'

interface Props {
	open: boolean
	onClose: () => void
}

type MessageState = {
	type: 'success' | 'error'
	text: string
} | null

const AddProjectsModal: FC<Props> = ({ open, onClose }) => {
	const { assignedProjects, setAssignedProjects, setLoading, loadVisibleProjects, projects } = useProjectAssignment()

	const [search, setSearch] = useState('')
	const [code, setCode] = useState('')
	const [client, setClient] = useState('all')
	const [status, setStatus] = useState('all')

	const [isSaving, setIsSaving] = useState(false)

	const clientOptions = useMemo(() => {
		const vals = Array.from(new Set(projects.map((p) => p.clientName).filter(Boolean)))
		return [{ value: 'all', label: 'Todos' }, ...vals.map((v) => ({ value: String(v), label: String(v) }))]
	}, [projects])

	const statusOptions = useMemo(() => {
		const vals = Array.from(new Set(projects.map((p) => p.status).filter(Boolean)))
		return [{ value: 'all', label: 'Todos' }, ...vals.map((v) => ({ value: String(v), label: String(v) }))]
	}, [projects])

	const hasFilters = search !== '' || code !== '' || client !== 'all' || status !== 'all'

	const filteredProjects = useMemo(() => {
		const normalizedSearch = search.trim().toLowerCase()
		const normalizedCode = code.trim().toLowerCase()

		return projects.filter((project) => {
			const matchesName = normalizedSearch.length === 0 || (project.name?.toLowerCase() ?? '').includes(normalizedSearch)
			const matchesCode = normalizedCode.length === 0 || (project.code?.toLowerCase() ?? '').includes(normalizedCode)
			const matchesClient = client === 'all' || project.clientName === client
			const matchesStatus = status === 'all' || project.status === status

			return matchesName && matchesCode && matchesClient && matchesStatus
		})
	}, [projects, search, code, client, status])

	const clearFilters = () => {
		setSearch('')
		setCode('')
		setClient('all')
		setStatus('all')
	}

	const handleSelectAll = () => {
		logger.infoTag(LogTag.View, `[PROJECT_ASSIGNMENT] Selecting all ${filteredProjects.length} filtered projects`)

		setAssignedProjects((previous) => {
			const existingIds = new Set(previous.map((p) => Number(p.project_id)))
			const toAdd: VisibleProjectDto[] = filteredProjects
				.filter((p) => !existingIds.has(Number(p.id)))
				.map((p) => ({
					id: 0,
					project_id: Number(p.id),
					project: {
						id: Number(p.id),
						name: p.name,
						code: p.code ?? '',
						status: p.status ?? '',
						client_name: p.clientName ?? '',
						client: { name: p.clientName ?? '' },
					},
				}))
			return [...previous, ...toAdd]
		})
	}

	const handleDeselectAll = () => {
		logger.infoTag(LogTag.View, `[PROJECT_ASSIGNMENT] Deselecting all ${filteredProjects.length} filtered projects`)

		const filteredIds = new Set(filteredProjects.map((p) => Number(p.id)))
		setAssignedProjects((previous) => previous.filter((p) => !filteredIds.has(Number(p.project_id))))
	}

	const [message, setMessage] = useState<MessageState>(null)

	const handleSave = async () => {
		try {
			setMessage(null)

			setIsSaving(true)

			setLoading(true)

			logger.infoTag(LogTag.View, `[PROJECT_ASSIGNMENT] Saving ${assignedProjects.length} visible projects`)

			await visibleProjectsAdapter.update({
				projectIds: assignedProjects.map((project) => Number(project.project_id)),
			})

			logger.infoTag(LogTag.View, '[PROJECT_ASSIGNMENT] Reloading visible projects')

			await loadVisibleProjects()

			logger.infoTag(LogTag.View, '[PROJECT_ASSIGNMENT] Visible projects updated successfully')

			setMessage({
				type: 'success',
				text: `Se actualizaron correctamente ${assignedProjects.length} proyectos visibles.`,
			})
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : String(error)

			logger.errorTag(LogTag.View, errorMessage)

			setMessage({
				type: 'error',
				text: 'Ocurrió un error al actualizar los proyectos visibles.',
			})
		} finally {
			setIsSaving(false)

			setLoading(false)
		}
	}

	if (!open) {
		return null
	}

	return (
		<div className="add-projects-modal">
			<div
				className="add-projects-modal__backdrop"
				onClick={() => {
					if (!isSaving) {
						onClose()
					}
				}}
			/>

			<div className="add-projects-modal__content">
				<div className="add-projects-modal__header">
					<div>
						<h2>Administrar proyectos visibles</h2>

						<p>
							Seleccioná los proyectos que querés visualizar en tu listado de proyectos y en los dashboards. Esta configuración es personal para tu usuario.
						</p>
					</div>

					<button type="button" onClick={onClose} disabled={isSaving}>
						<span className="material-icons">close</span>
					</button>
				</div>

				{message && (
					<div className={`add-projects-modal__message add-projects-modal__message--${message.type}`}>
						<span className="material-icons">{message.type === 'success' ? 'check_circle' : 'error'}</span>

						<span>{message.text}</span>
					</div>
				)}

				<div className="proyect-view-filters">
					<div className="proyect-view-search">
						<label className="proyect-view-search__label">Buscar por nombre</label>

						<div className="proyect-view-search__control">
							<span className="material-icons proyect-view-search__icon">search</span>

							<input
								className="proyect-view-search__input"
								value={search}
								placeholder="Buscar proyecto..."
								disabled={isSaving}
								onChange={(e) => setSearch(e.target.value)}
							/>
						</div>
					</div>

					<div className="proyect-view-filters__field">
						<label className="proyect-view-filters__label">Cliente</label>

						<select className="proyect-view-filters__select" value={client} disabled={isSaving} onChange={(e) => setClient(e.target.value)}>
							{clientOptions.map((opt) => (
								<option key={opt.value} value={opt.value}>{opt.label}</option>
							))}
						</select>
					</div>

					<div className="proyect-view-filters__field">
						<label className="proyect-view-filters__label">Estado</label>

						<select className="proyect-view-filters__select" value={status} disabled={isSaving} onChange={(e) => setStatus(e.target.value)}>
							{statusOptions.map((opt) => (
								<option key={opt.value} value={opt.value}>{opt.label}</option>
							))}
						</select>
					</div>

					<div className="proyect-view-search">
						<label className="proyect-view-search__label">Código</label>

						<div className="proyect-view-search__control">
							<span className="material-icons proyect-view-search__icon">tag</span>

							<input
								className="proyect-view-search__input"
								value={code}
								placeholder="Ej: 30.006"
								disabled={isSaving}
								onChange={(e) => setCode(e.target.value.toUpperCase())}
							/>
						</div>
					</div>

					<div className="proyect-view-filters__refresh">
						<ClearFiltersButton active={hasFilters} onClear={clearFilters} />
					</div>
				</div>

				<div className="add-projects-modal__bulk-actions">
					<span className="add-projects-modal__bulk-count">
						{filteredProjects.length} proyecto{filteredProjects.length !== 1 ? 's' : ''}
						{hasFilters ? ' encontrados' : ' en total'}
					</span>

					<div className="add-projects-modal__bulk-buttons">
						<button
							type="button"
							className="add-projects-modal__bulk-btn add-projects-modal__bulk-btn--select"
							onClick={handleSelectAll}
							disabled={isSaving || filteredProjects.length === 0}
						>
							Marcar todos
						</button>

						<button
							type="button"
							className="add-projects-modal__bulk-btn add-projects-modal__bulk-btn--select"
							onClick={handleDeselectAll}
							disabled={isSaving || filteredProjects.length === 0}
						>
							Desmarcar todos
						</button>
					</div>
				</div>

				<div className="add-projects-modal__body">
					{isSaving ? <SectionLoader text="Actualizando proyectos visibles..." /> : <SelectableProjectList projects={filteredProjects} />}
				</div>

				<div className="add-projects-modal__footer">
					<button type="button" className="add-projects-modal__save" onClick={handleSave} disabled={isSaving}>
						<span className={`material-icons ${isSaving ? 'spin' : ''}`}>{isSaving ? 'autorenew' : 'save'}</span>

						<span>{isSaving ? 'Guardando cambios...' : 'Guardar proyectos visibles'}</span>
					</button>
				</div>
			</div>
		</div>
	)
}

export default AddProjectsModal
