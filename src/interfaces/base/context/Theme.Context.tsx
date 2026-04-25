import { createContext, useContext } from 'react'
import { ThemeMode } from '../hooks/useAppTheme.h'

interface ThemeContextType {
	toggleTheme: () => void
	mode: ThemeMode
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export const useThemeContext = () => {
	const ctx = useContext(ThemeContext)
	if (!ctx) throw new Error('ThemeContext not found')
	return ctx
}

export default ThemeContext
