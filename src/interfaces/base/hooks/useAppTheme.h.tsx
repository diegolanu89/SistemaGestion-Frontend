import { useState, useEffect } from 'react'

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
		const body = document.body

		body.classList.remove('theme-dark', 'theme-light')
		body.classList.add(mode === 'dark' ? 'theme-dark' : 'theme-light')

		localStorage.setItem(STORAGE_KEY, mode)
	}, [mode])

	return {
		mode,
		toggleTheme,
	}
}
