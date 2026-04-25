import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './useAuth.h'

import logger from '../../base/controllers/Logger.c'
import { AuthLogEvent } from '../models/AuthLogEvent.m'
import { AuthLogMessages } from '../models/AuthLogMessages.m'

export const useLogin = () => {
	const { login, user } = useAuth()
	const navigate = useNavigate()

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [successAnimating, setSuccessAnimating] = useState(false)

	const handleSubmit = async () => {
		setError('')

		// ==========================
		// SUBMIT START
		// ==========================
		logger.info(AuthLogMessages[AuthLogEvent.SUBMIT_START], {
			email,
		})

		setLoading(true)

		try {
			// ==========================
			// LOGIN REQUEST
			// ==========================
			logger.info(AuthLogMessages[AuthLogEvent.LOGIN_REQUEST])

			await login(email, password)

			// ==========================
			// SUCCESS ANIMATION
			// ==========================
			setSuccessAnimating(true)

			setTimeout(() => {
				setSuccessAnimating(false)
				navigate('/')
			}, 700)
		} catch (err: unknown) {
			// ==========================
			// ERROR MAPPING (ENUM BASED)
			// ==========================

			const message = typeof err === 'object' && err !== null && 'message' in err ? String((err as { message?: unknown }).message) : ''

			// 🔴 NETWORK ERROR
			if (message.includes('Failed to fetch') || message.toLowerCase().includes('network')) {
				logger.error(AuthLogMessages[AuthLogEvent.NETWORK_ERROR])

				setError(AuthLogMessages[AuthLogEvent.NETWORK_ERROR])
				return
			}

			// 🔴 UNKNOWN / AUTH ERROR
			logger.error(AuthLogMessages[AuthLogEvent.UNKNOWN_ERROR])

			setError(message || AuthLogMessages[AuthLogEvent.UNKNOWN_ERROR])
		} finally {
			setLoading(false)
		}
	}

	return {
		email,
		password,
		setEmail,
		setPassword,
		handleSubmit,
		loading,
		error,
		successAnimating,
		user,
	}
}
