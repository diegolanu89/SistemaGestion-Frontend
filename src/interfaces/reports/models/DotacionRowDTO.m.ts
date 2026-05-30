export interface DotationRowDto {
	userId: number

	userName: string

	role: string

	leader: string

	clients: string[]

	projects: string[]

	totalHours: number

	capacity: number

	utilization: number

	deviation: number

	isBench: boolean

	forecastEtc: number

	futureCapacity: number

	futureDifference: number

	bac: number

	spi: number

	cpi: number

	status: 'healthy' | 'warning' | 'critical'

	months: Record<
		string,
		{
			hours: number
		}
	>
}
