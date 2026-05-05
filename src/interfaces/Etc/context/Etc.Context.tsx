// context/EtcContext.tsx

import { useMemo, useState, ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { EtcEntryDto } from '../model/Etc.m'
import { IEtcContext } from '../model/IEtcContext.m'
import { etcContext } from '../hooks/useEtcContext.h'

interface Props {
	children: ReactNode
}

export const EtcProvider = ({ children }: Props) => {
	const location = useLocation()

	const projectId = location.state?.projectId

	if (!projectId) {
		throw new Error('EtcProvider: projectId no recibido por navigation state')
	}

	const [entries, setEntries] = useState<EtcEntryDto[]>([])
	const [errors, setErrors] = useState<IEtcContext['errors']>([])
	const [loading, setLoading] = useState(false)

	const updateEntry = (index: number, hours: number) => {
		setEntries((prev) => {
			const copy = [...prev]
			copy[index] = {
				...copy[index],
				hours,
			}
			return copy
		})
	}

	const value = useMemo<IEtcContext>(
		() => ({
			projectId,
			entries,
			setEntries,
			updateEntry,
			errors,
			setErrors,
			loading,
			setLoading,
		}),
		[projectId, entries, errors, loading]
	)

	return <etcContext.Provider value={value}>{children}</etcContext.Provider>
}
