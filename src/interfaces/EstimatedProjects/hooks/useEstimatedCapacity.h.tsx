// hooks/useEstimatedCapacity.h.tsx

import { useEffect, useState } from 'react'
import { estimatedProjectAdapter } from '../services/EstimatedProjectAdapter.s'
import { CapacityLimitsMap } from '../models/EstimatedProjectDTO.m'

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'

interface Args {
	userNames: string[]
	monthKeys: string[]
	potencialProjectId?: number | null
}

interface State {
	limits: CapacityLimitsMap
	loading: boolean
}

export const useEstimatedCapacity = ({ userNames, monthKeys, potencialProjectId }: Args): State => {
	const [state, setState] = useState<State>({ limits: {}, loading: false })

	const userKey = userNames.slice().sort().join('|')
	const monthKey = monthKeys.join('|')

	useEffect(() => {
		let cancelled = false

		const run = async () => {
			if (monthKeys.length === 0 || userNames.length === 0) {
				setState({ limits: {}, loading: false })
				return
			}

			setState((prev) => ({ ...prev, loading: true }))

			try {
				const res = await estimatedProjectAdapter.getCapacityLimits({
					userNames,
					monthKeys,
					potencialProjectId: potencialProjectId ?? null,
				})

				if (cancelled) return
				setState({ limits: res.limits, loading: false })
			} catch (error: unknown) {
				const err = error instanceof Error ? error : new Error('Unknown error fetching capacity limits')
				logger.errorTag(LogTag.Adapter, err)
				if (!cancelled) setState((prev) => ({ ...prev, loading: false }))
			}
		}

		void run()

		return () => {
			cancelled = true
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userKey, monthKey, potencialProjectId])

	return state
}
