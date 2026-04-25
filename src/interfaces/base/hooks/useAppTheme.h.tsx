import { useState, useEffect } from 'react'
import { Theme } from '@mui/material/styles'

import { styleLight, styleTravel } from '../context/Style.Context'

export type ThemeMode = 'dark' | 'light'

export const useAppTheme = () => {
	const [mode, setMode] = useState<ThemeMode>('dark')

	const toggleTheme = () => {
		setMode((prev) => (prev === 'dark' ? 'light' : 'dark'))
	}

	// 🔥 ESTO ES LO QUE TE FALTABA
	useEffect(() => {
		document.body.classList.toggle('theme-dark', mode === 'dark')
	}, [mode])

	const theme: Theme = mode === 'dark' ? styleTravel : styleLight

	return {
		theme,
		mode,
		toggleTheme,
	}
}
