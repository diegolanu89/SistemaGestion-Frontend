import { LoginControllerLogEvent } from './LoginControllerEvent.m'

export const LoginControllerLogMessages: Record<LoginControllerLogEvent, string> = {
	[LoginControllerLogEvent.FORM_SUBMIT]: 'Login form submitted',
	[LoginControllerLogEvent.NAVIGATE_HOME]: 'Navigation to home',
	[LoginControllerLogEvent.ERROR]: 'Login error',
}
