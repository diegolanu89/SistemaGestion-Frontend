export interface DashboardEvmFilters {
	client: string
	project: string
	status: string
	vacMin: string
	vacMax: string
	/** Rango sobre startDate, formato 'YYYY-MM-DD'. */
	dateFrom: string
	dateTo: string
	/** Fin planificado (endDatePlanned), formato 'YYYY-MM-DD'. */
	endPlannedFrom: string
	endPlannedTo: string
	/** Fin real (endDateActual), formato 'YYYY-MM-DD'. */
	endActualFrom: string
	endActualTo: string
}

export const DEFAULT_DASHBOARD_EVM_FILTERS: DashboardEvmFilters = {
	client: '',
	project: '',
	status: '',
	vacMin: '',
	vacMax: '',
	dateFrom: '',
	dateTo: '',
	endPlannedFrom: '',
	endPlannedTo: '',
	endActualFrom: '',
	endActualTo: '',
}
