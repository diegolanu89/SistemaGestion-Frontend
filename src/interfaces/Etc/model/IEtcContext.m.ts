import { EtcEntryDto } from './Etc.m'

export interface IEtcContext {
	projectId: number

	entries: EtcEntryDto[]
	setEntries: (entries: EtcEntryDto[]) => void

	updateEntry: (index: number, hours: number) => void

	errors: {
		message: string
		userName?: string
		monthKey?: string
	}[]
	setErrors: (errors: IEtcContext['errors']) => void

	loading: boolean
	setLoading: (value: boolean) => void
}
