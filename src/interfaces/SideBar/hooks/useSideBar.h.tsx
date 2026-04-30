/* eslint-disable no-empty */
import { useState, useEffect } from 'react'

const STORAGE_KEY = 'sidebar_state'

type SideBarStorage = {
	open: Record<string, boolean>
	isOpen: boolean
}

export const useSideBar = () => {
	const getInitialState = (): SideBarStorage => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY)
			if (!raw) return { open: {}, isOpen: true }

			return JSON.parse(raw)
		} catch {
			return { open: {}, isOpen: true }
		}
	}

	const initial = getInitialState()

	const [open, setOpen] = useState<Record<string, boolean>>(initial.open)
	const [isOpen, setIsOpen] = useState<boolean>(initial.isOpen)

	const saveState = (nextOpen: Record<string, boolean>, nextIsOpen: boolean) => {
		try {
			localStorage.setItem(
				STORAGE_KEY,
				JSON.stringify({
					open: nextOpen,
					isOpen: nextIsOpen,
				})
			)
		} catch {}
	}

	const toggle = (label: string) => {
		setOpen((prev) => {
			const next = {
				...prev,
				[label]: !prev[label],
			}

			saveState(next, isOpen)

			return next
		})
	}

	const toggleSidebar = () => {
		setIsOpen((prev) => {
			const next = !prev

			saveState(open, next)

			return next
		})
	}

	useEffect(() => {
		saveState(open, isOpen)
	}, [open, isOpen])

	return {
		open,
		toggle,
		isOpen,
		toggleSidebar,
	}
}
