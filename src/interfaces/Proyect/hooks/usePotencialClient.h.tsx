import { useEffect, useState } from 'react'
import { PotencialClientDto } from '../models/PotencialClientDTO.m'
import { potencialClientAdapter } from '../services/PotencialClientsAdapter.s'

export const usePotencialClients = () => {
	const [clients, setClients] = useState<PotencialClientDto[]>([])
	const [loading, setLoading] = useState<boolean>(true)

	useEffect(() => {
		const fetch = async () => {
			try {
				const data = await potencialClientAdapter.getAll()
				setClients(data)
			} finally {
				setLoading(false)
			}
		}

		void fetch()
	}, [])

	return { clients, loading }
}
