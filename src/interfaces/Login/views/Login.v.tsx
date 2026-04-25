import { LoginHeader } from '../components/LoginHeader'
import { LoginForm } from '../components/LoginForm'
import { LoginContainer } from '../components/LoginConteiner'
import { useLogin } from '../hooks/useLogin.h'

const LoginView = () => {
	const { email, password, setEmail, setPassword, handleSubmit, loading, error, successAnimating } = useLogin()

	return (
		<LoginContainer>
			<LoginHeader successAnimating={successAnimating} />

			<LoginForm
				email={email}
				password={password}
				loading={loading}
				error={error}
				onEmailChange={setEmail}
				onPasswordChange={setPassword}
				onSubmit={handleSubmit}
			/>
		</LoginContainer>
	)
}

export default LoginView
