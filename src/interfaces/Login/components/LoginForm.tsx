import { Login } from '../models/Login.m'
import { LoginAlert } from './LoginAlert'

interface Props {
	email: string
	password: string
	loading: boolean
	error?: string
	onEmailChange: (v: string) => void
	onPasswordChange: (v: string) => void
	onSubmit: () => void
}

export const LoginForm = ({ email, password, loading, error, onEmailChange, onPasswordChange, onSubmit }: Props) => {
	return (
		<form
			className="login-form"
			onSubmit={(e) => {
				e.preventDefault()
				onSubmit()
			}}
		>
			{/* EMAIL */}
			<label className="login-form__label">{Login.TEXTS.EMAIL_LABEL}</label>

			<input type="email" value={email} onChange={(e) => onEmailChange(e.target.value)} className="login-form__input" required />

			{/* PASSWORD */}
			<label className="login-form__label">{Login.TEXTS.PASSWORD_LABEL}</label>

			<input type="password" value={password} onChange={(e) => onPasswordChange(e.target.value)} className="login-form__input" required />

			{/* ALERT COMPONENT */}
			<LoginAlert message={error} />

			{/* BUTTON */}
			<button type="submit" className="login-form__button" disabled={loading}>
				{loading ? Login.TEXTS.BUTTON_LOADING : Login.TEXTS.BUTTON_LOGIN}
			</button>
		</form>
	)
}
