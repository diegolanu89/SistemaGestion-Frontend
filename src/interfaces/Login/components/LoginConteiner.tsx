import { Login } from '../models/Login.m'

interface Props {
	children: React.ReactNode
}

export const LoginContainer = ({ children }: Props) => {
	return (
		<div className="login-container">
			<div className="login-container__card" style={{ maxWidth: Login.STYLES.MAX_WIDTH }}>
				{children}
			</div>
		</div>
	)
}
