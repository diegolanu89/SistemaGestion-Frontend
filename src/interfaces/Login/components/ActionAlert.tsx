// components/ActionAlert.tsx
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useProyectContext } from '../../Proyect/hooks/useProyectContext.h'

export const ActionAlert = () => {
	const { createStatus, createMessage } = useProyectContext()

	if (!createMessage) return null

	const variant = createStatus === 'error' ? 'error' : 'success'

	return createPortal(
		<div className="login-alert-wrapper">
			<AnimatePresence>
				<motion.div
					key={variant}
					className={`login-alert login-alert--${variant}`}
					initial={{ opacity: 0, y: -10, scale: 0.95 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: -10, scale: 0.95 }}
					transition={{
						type: 'spring',
						stiffness: 320,
						damping: 22,
					}}
				>
					<span>{variant === 'success' ? '✅' : '⚠️'}</span>
					<span>{createMessage}</span>
				</motion.div>
			</AnimatePresence>
		</div>,
		document.body
	)
}
