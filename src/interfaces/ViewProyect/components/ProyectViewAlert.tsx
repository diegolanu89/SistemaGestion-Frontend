import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useProyectViewContext } from '../hooks/useProyectViewContext.h'

export const ProyectViewAlert = () => {
	const { error } = useProyectViewContext()

	if (!error) return null

	return createPortal(
		<div className="login-alert-wrapper">
			<AnimatePresence>
				<motion.div
					key="error"
					className="login-alert login-alert--error"
					initial={{ opacity: 0, y: -10, scale: 0.95 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: -10, scale: 0.95 }}
					transition={{
						type: 'spring',
						stiffness: 320,
						damping: 22,
					}}
				>
					<span>⚠️</span>
					<span>{error}</span>
				</motion.div>
			</AnimatePresence>
		</div>,
		document.body
	)
}
