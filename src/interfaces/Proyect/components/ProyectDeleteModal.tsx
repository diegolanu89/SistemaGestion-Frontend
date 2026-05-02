import { FC, useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useProyectContext } from '../hooks/useProyectContext.h'
import { proyectAdapter } from '../services/ProyectAdapter.s'
import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'
import { ActionAlert } from '../../base/components/alert/ActionAlert'

export const ProyectDeleteModal: FC = () => {
	const { isDeleteOpen, closeDelete, selectedProject, refetch, setDeleteStatus, setDeleteMessage } = useProyectContext()

	const [submitting, setSubmitting] = useState(false)

	const projectName = useMemo(() => {
		return selectedProject?.ProjectName?.trim() || 'Proyecto sin nombre'
	}, [selectedProject])

	if (!isDeleteOpen || !selectedProject) return null

	const handleConfirm = async (): Promise<void> => {
		try {
			setSubmitting(true)
			setDeleteStatus('loading')
			setDeleteMessage(null)

			await proyectAdapter.delete(selectedProject.Id)

			logger.infoTag(LogTag.Adapter, `[PROYECT] delete -> id=${selectedProject.Id}`)

			setDeleteStatus('success')
			setDeleteMessage(`"${projectName}" fue eliminado`)

			await refetch()

			setTimeout(() => {
				closeDelete()
				setDeleteStatus('idle')
				setDeleteMessage(null)
			}, 1200)
		} catch (error) {
			logger.errorTag(LogTag.Adapter, error as Error)

			setDeleteStatus('error')
			setDeleteMessage(`No se pudo eliminar "${projectName}"`)

			setTimeout(() => {
				setDeleteStatus('idle')
				setDeleteMessage(null)
			}, 2500)
		} finally {
			setSubmitting(false)
		}
	}

	return createPortal(
		<>
			<ActionAlert />

			<AnimatePresence>
				<motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
					<motion.div
						className="proyect-delete-modal"
						initial={{ scale: 0.94, opacity: 0, y: 10 }}
						animate={{ scale: 1, opacity: 1, y: 0 }}
						exit={{ scale: 0.94, opacity: 0, y: 10 }}
						transition={{ type: 'spring', stiffness: 280, damping: 22 }}
					>
						<div className="proyect-delete-modal__header">
							<span className="material-icons">report_problem</span>
							<h2>Eliminar proyecto</h2>
						</div>

						<div className="proyect-delete-modal__content">
							<p>Vas a eliminar:</p>

							<p className="proyect-delete-modal__project">{projectName}</p>

							<div className="proyect-delete-modal__warning">
								<span className="material-icons">warning</span>
								<span>Esta acción es irreversible</span>
							</div>
						</div>

						<div className="proyect-delete-modal__actions">
							<button className="proyect-delete-btn proyect-delete-btn--cancel" onClick={closeDelete} disabled={submitting}>
								Cancelar
							</button>

							<button className="proyect-delete-btn proyect-delete-btn--confirm" onClick={() => void handleConfirm()} disabled={submitting}>
								{submitting ? 'Eliminando...' : 'Eliminar'}
							</button>
						</div>
					</motion.div>
				</motion.div>
			</AnimatePresence>
		</>,
		document.body
	)
}
