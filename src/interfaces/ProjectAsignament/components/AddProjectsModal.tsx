import { FC, useState } from 'react'

import SelectableProjectList from './SelectableProjectList'

import { useProjectAssignment } from '../hooks/useProjectAsignment.h'

import { SectionLoader } from '../../base/components/loading/SectionLoader'

import logger from '../../base/controllers/Logger.c'

import { LogTag } from '../../base/model/LogTag.m'

import { visibleProjectsAdapter } from '../services/ProjectAsignamentAdapter.s'

interface Props {
	open: boolean
	onClose: () => void
}

type MessageState = {
	type: 'success' | 'error'
	text: string
} | null

const AddProjectsModal: FC<Props> = ({ open, onClose }) => {
	const { assignedProjects, setLoading, loadVisibleProjects } = useProjectAssignment()

	const [search, setSearch] = useState('')

	const [code, setCode] = useState('')

	const [isSaving, setIsSaving] = useState(false)

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

				<div className="add-projects-modal__search">
					<div className="add-projects-modal__search-field">
						<span className="material-icons">tag</span>

						<input
							type="text"
							placeholder="Buscar por código"
							value={code}
							onChange={(event) => setCode(event.target.value.toUpperCase())}
							disabled={isSaving}
						/>
					</div>

					<div className="add-projects-modal__search-field">
						<span className="material-icons">search</span>

						<input type="text" placeholder="Buscar por nombre" value={search} onChange={(event) => setSearch(event.target.value)} disabled={isSaving} />
					</div>
				</div>

				<div className="add-projects-modal__body">
					{isSaving ? <SectionLoader text="Actualizando proyectos visibles..." /> : <SelectableProjectList search={search} code={code} />}
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
