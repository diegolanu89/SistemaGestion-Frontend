import { useState, useEffect } from 'react'
import { Theme } from '@mui/material/styles'

import { styleLight, styleTravel } from '../context/Style.Context'

export type ThemeMode = 'dark' | 'light'

const STORAGE_KEY = 'app-theme-mode'

export const useAppTheme = () => {
	const [mode, setMode] = useState<ThemeMode>(() => {
		const stored = localStorage.getItem(STORAGE_KEY)
		return stored === 'light' || stored === 'dark' ? stored : 'dark'
	})

	const toggleTheme = () => {
		setMode((prev) => (prev === 'dark' ? 'light' : 'dark'))
	}

	useEffect(() => {
		document.body.classList.toggle('theme-dark', mode === 'dark')
		localStorage.setItem(STORAGE_KEY, mode)
	}, [mode])

	const theme: Theme = mode === 'dark' ? styleTravel : styleLight

	return {
		theme,
		mode,
		toggleTheme,
	}
}
