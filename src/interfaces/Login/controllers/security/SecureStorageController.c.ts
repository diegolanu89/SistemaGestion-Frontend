// Login/utils/SecureStorage.ts
import { Preferences } from '@capacitor/preferences'

const isNativeApp = () => window.location.protocol === 'capacitor:'

export class SecureStorage {
	static async setItem(key: string, value: string): Promise<void> {
		if (isNativeApp()) {
			await Preferences.set({ key, value })
			return
		}
		localStorage.setItem(key, value)
	}

	static async getItem(key: string): Promise<string | null> {
		if (isNativeApp()) {
			const { value } = await Preferences.get({ key })
			return value ?? null
		}
		return localStorage.getItem(key)
	}

	static async removeItem(key: string): Promise<void> {
		if (isNativeApp()) {
			await Preferences.remove({ key })
			return
		}
		localStorage.removeItem(key)
	}
}
