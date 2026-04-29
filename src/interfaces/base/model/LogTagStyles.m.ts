import { LogTag } from './LogTag.m'

export const LOG_TAG_STYLES: Record<LogTag, string> = {
	[LogTag.Adapter]: 'color: #42a5f5; font-weight: bold',
	[LogTag.UseBiometricStatus]: 'color: #26a69a; font-weight: bold',
	[LogTag.SessionSocket]: 'color: #ffca28; font-weight: bold',
	[LogTag.AuthSession]: 'color: #ab47bc; font-weight: bold',

	[LogTag.EditProfileState]: 'color: rgb(0, 254, 97); font-weight: bold',
	[LogTag.Biometric]: 'color: rgb(216, 254, 0); font-weight: bold',

	[LogTag.TravelTimeline]: 'color: #26c6da; font-weight: bold',
	[LogTag.Maps]: 'color:#8b5cf6;font-weight:bold;',
	[LogTag.Provider]: 'color: #ff7043; font-weight: bold',
	[LogTag.Cache]: 'color: #bc42f5; font-weight: bold',
	[LogTag.AdapterERROR]: 'color: #ff7043; font-weight: bold',
}
