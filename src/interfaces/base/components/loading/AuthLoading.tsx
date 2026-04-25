import { useLogoByApp } from '../../hooks/useLogoByApp.h'

export const AuthLoading = () => {
	const logo = useLogoByApp()

	return (
		<div className="auth-loading">
			<img src={logo} alt="Loading" className="auth-loading__logo" />
		</div>
	)
}
