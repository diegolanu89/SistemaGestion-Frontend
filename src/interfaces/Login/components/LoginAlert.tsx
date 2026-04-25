import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'

interface Props {
	message?: string
}

export const LoginAlert = ({ message }: Props) => {
	if (!message) return null

	return createPortal(
		<div className="login-alert-wrapper">
			<AnimatePresence>
				<motion.div
					className="login-alert"
					initial={{ opacity: 0, y: -10, scale: 0.95 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: -10, scale: 0.95 }}
					transition={{
						type: 'spring',
						stiffness: 320,
						damping: 22,
					}}
				>
					<span>⚠</span>
					<span>{message}</span>
				</motion.div>
			</AnimatePresence>
		</div>,
		document.body
	)
}
