import BDT from '../../../images/brandt/bdt.png'
import { AppMode } from '../model/EAppMode.m'

const APP_LOGOS: Record<AppMode, string> = {
	[AppMode.ERS]: BDT,
	[AppMode.MOCK]: BDT,
}

export const useLogoByApp = (): string => {
	return APP_LOGOS[AppMode.ERS]
}
