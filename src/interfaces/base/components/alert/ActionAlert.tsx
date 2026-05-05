import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useMemo } from 'react'
import { useProyectContext } from '../../../Proyect/hooks/useProyectContext.h'

type Variant = 'success' | 'error'

export const ActionAlert = () => {
	const { createStatus, createMessage, editStatus, editMessage, deleteStatus, deleteMessage } = useProyectContext()

	const { message, status } = useMemo(() => {
		if (deleteMessage) {
			return { message: deleteMessage, status: deleteStatus }
		}

		if (editMessage) {
			return { message: editMessage, status: editStatus }
		}

		if (createMessage) {
			return { message: createMessage, status: createStatus }
		}

		return { message: null, status: 'idle' }
	}, [deleteMessage, deleteStatus, editMessage, editStatus, createMessage, createStatus])

	if (!message) return null

	const variant: Variant = status === 'error' ? 'error' : 'success'
	const icon = variant === 'success' ? 'check_circle' : 'warning'

	return createPortal(
		<div className="login-alert-wrapper">
			<AnimatePresence>
				<motion.div
					key={`${variant}-${message}`}
					className={`login-alert login-alert--${variant}`}
					initial={{ opacity: 0, y: -12, scale: 0.96 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: -12, scale: 0.96 }}
					transition={{
						type: 'spring',
						stiffness: 320,
						damping: 24,
					}}
				>
					<span className="material-icons">{icon}</span>
					<span>{message}</span>
				</motion.div>
			</AnimatePresence>
		</div>,
		document.body
	)
}
