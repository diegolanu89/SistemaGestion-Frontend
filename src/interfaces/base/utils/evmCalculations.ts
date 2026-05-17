export interface EvmInput {
	bacBaseHours: number
	bacTotalHours: number
	etcHours?: number | null
}

export interface EvmMetrics {
	bac: number
	ac: number
	etc: number
	eac: number
	vac: number
	advance: number
	changeControl: number
}

export const AC_PLACEHOLDER_RATIO = 0.62

export const calcAc = (input: EvmInput): number => input.bacTotalHours * AC_PLACEHOLDER_RATIO

export const calcEtc = (input: EvmInput): number => input.etcHours ?? 0

export const calcEac = (input: EvmInput): number => calcAc(input) + calcEtc(input)

export const calcVac = (input: EvmInput): number => input.bacTotalHours - calcEac(input)

export const calcAdvance = (input: EvmInput): number => (input.bacTotalHours > 0 ? Math.round((calcAc(input) / input.bacTotalHours) * 100) : 0)

export const calcChangeControl = (input: EvmInput): number => input.bacTotalHours - input.bacBaseHours

export const calcEvmMetrics = (input: EvmInput): EvmMetrics => ({
	bac: input.bacTotalHours,
	ac: calcAc(input),
	etc: calcEtc(input),
	eac: calcEac(input),
	vac: calcVac(input),
	advance: calcAdvance(input),
	changeControl: calcChangeControl(input),
})
