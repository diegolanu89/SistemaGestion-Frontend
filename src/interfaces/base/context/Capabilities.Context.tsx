import { createContext, useContext, useMemo } from 'react'
import { useAuth } from '../../Login/hooks/useAuth.h'
import { buildCapabilities, Capabilities } from '../model/Capabilities.m'

const CapabilitiesContext = createContext<Capabilities | null>(null)

export const CapabilitiesProvider = ({ children }: { children: React.ReactNode }) => {
	const { user } = useAuth()

	const capabilities = useMemo(() => buildCapabilities(user), [user])

	return <CapabilitiesContext.Provider value={capabilities}>{children}</CapabilitiesContext.Provider>
}

export const useCapabilities = (): Capabilities => {
	const ctx = useContext(CapabilitiesContext)
	if (!ctx) throw new Error('CapabilitiesProvider missing')
	return ctx
}
