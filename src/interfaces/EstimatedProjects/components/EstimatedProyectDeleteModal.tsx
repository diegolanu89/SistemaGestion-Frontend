import { FC } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

interface EstimatedDeleteModalProps {
	projectName: string
	clientName?: string | null
	error?: string | null
	deleting: boolean
	onCancel: () => void
	onConfirm: () => void
}

export const EstimatedDeleteModal: FC<EstimatedDeleteModalProps> = ({ projectName, clientName, error, deleting, onCancel, onConfirm }) => {
	return createPortal(
		<AnimatePresence>
			<motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
				<motion.div
					className="proyect-delete-modal"
					initial={{ scale: 0.94, opacity: 0, y: 10 }}
					animate={{ scale: 1, opacity: 1, y: 0 }}
					exit={{ scale: 0.94, opacity: 0, y: 10 }}
					transition={{ type: 'spring', stiffness: 280, damping: 22 }}
				>
					{/* HEADER */}
					<div className="proyect-delete-modal__header">
						<span className="material-icons">report_problem</span>
						<h2>Eliminar proyecto estimado</h2>
					</div>

					{/* CONTENT */}
					<div className="proyect-delete-modal__content">
						<p>Vas a eliminar:</p>

						<p className="proyect-delete-modal__project">
							{projectName}
							{clientName ? ` (${clientName})` : ''}
						</p>

						<div className="proyect-delete-modal__warning">
							<span className="material-icons">warning</span>
							<span>Esta acción es irreversible</span>
						</div>

						{error && <p className="proyect-delete-modal__error">{error}</p>}
					</div>

					{/* ACTIONS */}
					<div className="proyect-delete-modal__actions">
						<button className="proyect-delete-btn proyect-delete-btn--cancel" onClick={onCancel} disabled={deleting}>
							Cancelar
						</button>

						<button className="proyect-delete-btn proyect-delete-btn--confirm" onClick={onConfirm} disabled={deleting}>
							{deleting ? 'Eliminando...' : 'Eliminar'}
						</button>
					</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>,
		document.body
	)
}
