import { capacityAdapter } from '../service/CapacityAdapter'

export const useCapacity = () => {
	return {
		validateCapacity: capacityAdapter.validateCapacity.bind(capacityAdapter),

		getCapacityLimits: capacityAdapter.getCapacityLimits.bind(capacityAdapter),
	}
}
