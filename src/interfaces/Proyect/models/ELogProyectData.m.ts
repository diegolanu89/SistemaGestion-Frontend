// models/LogProyectData.m.ts

export enum LogProyectData {
	// CACHE
	CACHE_HIT = '[PROYECT][CACHE] HIT',
	CACHE_MISS = '[PROYECT][CACHE] MISS',
	CACHE_SET = '[PROYECT][CACHE] SET',
	CACHE_FORCE = '[PROYECT][CACHE] FORCE REFRESH',

	// FETCH
	FETCH_START = '[PROYECT] Fetching from API...',
	FETCH_SUCCESS = '[PROYECT] Fetch success',

	// ERROR
	ERROR_UNKNOWN = '[PROYECT] Unknown error',
}
