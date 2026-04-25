import { useState } from 'react'

export const useSideBar = () => {
	const [open, setOpen] = useState<Record<string, boolean>>({})
	const [isOpen, setIsOpen] = useState(true)

	const toggle = (label: string) => {
		setOpen((prev) => ({
			...prev,
			[label]: !prev[label],
		}))
	}

	const toggleSidebar = () => {
		setIsOpen((prev) => !prev)
	}

	return {
		open,
		toggle,
		isOpen,
		toggleSidebar,
	}
}
