import { FC } from 'react'

interface Props {
	type?: 'error' | 'success' | 'warning' | 'info'
	message: string
}

export const InlineStatusMessage: FC<Props> = ({ type = 'error', message }) => {
	const icon = {
		error: 'error',
		success: 'check_circle',
		warning: 'warning',
		info: 'info',
	}[type]

	return (
		<div className={`inline-status-message inline-status-message--${type}`}>
			<span className="material-icons">{icon}</span>

			<span>{message}</span>
		</div>
	)
}

export default InlineStatusMessage
