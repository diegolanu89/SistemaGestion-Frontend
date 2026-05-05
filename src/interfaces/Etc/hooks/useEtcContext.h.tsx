import { createContext, useContext } from 'react'
import { IEtcContext } from '../model/IEtcContext.m'

export const etcContext = createContext<IEtcContext | null>(null)

export const useEtcContext = () => {
	const ctx = useContext(etcContext)

	if (!ctx) {
		throw new Error('useEtcContext debe usarse dentro de EtcProvider')
	}

	return ctx
}
