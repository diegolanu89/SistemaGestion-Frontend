import { motion } from 'framer-motion'
import { Login } from '../models/Login.m'

const MotionDiv = motion.div

interface Props {
	successAnimating: boolean
}

export const LoginHeader = ({ successAnimating }: Props) => {
	const isAnimEnabled = Login.ANIMATIONS.ENABLED
	const hideContent = successAnimating

	return (
		<div className="login-header">
			{/* LOGO */}
			<MotionDiv
				animate={hideContent ? { scale: 0.6, opacity: 0 } : isAnimEnabled ? { scale: 1, opacity: 1 } : false}
				transition={{
					type: 'spring',
					stiffness: 260,
					damping: 18,
					mass: 0.6,
				}}
				className="login-header__logo-container"
			>
				<img src={Login.IMAGES.LOGO} alt={Login.IMAGES.LOGO_ALT} className="login-header__logo" />
			</MotionDiv>

			{/* TEXT */}
			<MotionDiv
				animate={hideContent ? { opacity: 0, y: -12 } : isAnimEnabled ? { opacity: 1, y: 0 } : false}
				transition={{
					type: 'spring',
					stiffness: 300,
					damping: 22,
				}}
				className="login-header__text"
			>
				<h2 className="login-header__title">{Login.TEXTS.TITLE_LOGIN}</h2>

				<p className="login-header__subtitle">Ingresá tus credenciales para continuar</p>
			</MotionDiv>

			{/* OVERLAY SUCCESS (MERCADO PAGO STYLE) */}
			{successAnimating && (
				<MotionDiv
					initial={{ scale: 0, opacity: 0.5 }}
					animate={{
						scale: 35,
						opacity: 1,
					}}
					transition={{
						type: 'spring',
						stiffness: 180,
						damping: 20,
						mass: 1,
					}}
					className="login-header__overlay"
				/>
			)}
		</div>
	)
}
