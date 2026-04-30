// hooks/useEstimatedCapacity.h.ts

import { useEffect, useState } from 'react'
import { estimatedProjectAdapter } from '../services/EstimatedProjectAdapter.s'
import { MonthlyCapacityDto, UserMonthWorkloadDto } from '../models/EstimatedProjectDTO.m'

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'

interface Args {
	userIds: number[]
	monthKeys: string[]
}

interface State {
	capacities: MonthlyCapacityDto[]
	workload: UserMonthWorkloadDto[]
	loading: boolean
}

export const useEstimatedCapacity = ({ userIds, monthKeys }: Args): State => {
	const [state, setState] = useState<State>({ capacities: [], workload: [], loading: false })

	const userKey = userIds.slice().sort((a, b) => a - b).join(',')
	const monthKey = monthKeys.join(',')

	useEffect(() => {
		let cancelled = false

		const run = async () => {
			if (monthKeys.length === 0) {
				setState({ capacities: [], workload: [], loading: false })
				return
			}

			setState((prev) => ({ ...prev, loading: true }))

			try {
				const [capacities, workload] = await Promise.all([
					estimatedProjectAdapter.getMonthlyCapacities(monthKeys),
					userIds.length > 0 ? estimatedProjectAdapter.getUserWorkload(userIds, monthKeys) : Promise.resolve([] as UserMonthWorkloadDto[]),
				])

				if (cancelled) return

				setState({ capacities, workload, loading: false })
			} catch (error: unknown) {
				const err = error instanceof Error ? error : new Error('Unknown error fetching capacity')
				logger.errorTag(LogTag.Adapter, err)
				if (!cancelled) setState((prev) => ({ ...prev, loading: false }))
			}
		}

		void run()

		return () => {
			cancelled = true
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userKey, monthKey])

	return state
}
