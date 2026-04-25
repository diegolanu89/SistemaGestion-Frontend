import { FC } from 'react'
import { useThemeContext } from '../../../base/context/Theme.Context'

export const ThemeToggle: FC = () => {
	const { toggleTheme, mode } = useThemeContext()

	const isDark = mode === 'dark'

	return (
		<button className="theme-toggle-icon" onClick={toggleTheme} aria-label="Cambiar tema" title={isDark ? 'Modo oscuro' : 'Modo claro'} type="button">
			<span className="material-icons">{isDark ? 'dark_mode' : 'light_mode'}</span>
		</button>
	)
}
