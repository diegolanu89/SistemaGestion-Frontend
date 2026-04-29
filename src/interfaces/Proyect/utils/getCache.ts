// utils/cache.ts

interface CachePayload<T> {
	data: T
	expiration: number
}

export const getCache = <T>(key: string): T | null => {
	try {
		const raw = localStorage.getItem(key)
		if (!raw) return null

		const parsed: CachePayload<T> = JSON.parse(raw)

		if (Date.now() > parsed.expiration) {
			localStorage.removeItem(key)
			return null
		}

		return parsed.data
	} catch {
		return null
	}
}

export const setCache = <T>(key: string, data: T, ttl: number): void => {
	const payload: CachePayload<T> = {
		data,
		expiration: Date.now() + ttl,
	}

	localStorage.setItem(key, JSON.stringify(payload))
}
