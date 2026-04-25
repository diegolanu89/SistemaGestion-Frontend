import { APP_PROFILES } from '../model/AppProfileConfig.m'

export const getActiveAppProfile = () => {
	return APP_PROFILES[APP_PROFILES.__ACTIVE_MODE__]
}
