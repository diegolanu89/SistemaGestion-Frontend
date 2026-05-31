export interface DashboardEvmFilters {
	client: string
	project: string
	vacMin: string
	vacMax: string
}

export const DEFAULT_DASHBOARD_EVM_FILTERS: DashboardEvmFilters = {
	client: '',
	project: '',
	vacMin: '',
	vacMax: '',
}
