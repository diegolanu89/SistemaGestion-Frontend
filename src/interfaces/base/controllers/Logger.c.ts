import { LogTag } from '../model/LogTag.m'
import { LOG_TAG_STYLES } from '../model/LogTagStyles.m'

export type LogLevel = 'info' | 'warn' | 'error' | 'debug'

const isDev = import.meta.env.MODE === 'development'

const levelStyles: Record<LogLevel, string> = {
	info: 'color: #4caf50; font-weight: bold',
	warn: 'color: #ff9800; font-weight: bold',
	error: 'color: #f44336; font-weight: bold',
	debug: 'color: #2196f3; font-weight: bold',
}

/** 🎨 Estilos por tag (runtime) */
const tagStyles: Partial<Record<LogTag, string>> = {}

let tagsInitialized = false

class Logger {
	// =========================================================================
	// CORE
	// =========================================================================
	private shouldLog(): boolean {
		return isDev
	}

	private formatMessage(level: LogLevel, message: string): string {
		const time = new Date().toLocaleTimeString()
		return `[${time}] [${level.toUpperCase()}] ${message}`
	}

	// =========================================================================
	// INTERNAL INIT (AUTO)
	// =========================================================================
	private initIfNeeded(): void {
		if (tagsInitialized || !this.shouldLog()) return
		;(Object.entries(LOG_TAG_STYLES) as [LogTag, string][]).forEach(([tag, style]) => {
			tagStyles[tag] = style
		})

		tagsInitialized = true
	}

	// =========================================================================
	// LOG BÁSICO
	// =========================================================================
	info(message: string, ...optional: unknown[]): void {
		if (!this.shouldLog()) return
		console.log(`%c${this.formatMessage('info', message)}`, levelStyles.info, ...optional)
	}

	warn(message: string, ...optional: unknown[]): void {
		if (!this.shouldLog()) return
		console.warn(`%c${this.formatMessage('warn', message)}`, levelStyles.warn, ...optional)
	}

	error(message: string | Error, ...optional: unknown[]): void {
		if (!this.shouldLog()) return

		if (message instanceof Error) {
			console.error(`%c${this.formatMessage('error', message.message)}`, levelStyles.error, message.stack, ...optional)
		} else {
			console.error(`%c${this.formatMessage('error', message)}`, levelStyles.error, ...optional)
		}
	}

	debug(message: string, ...optional: unknown[]): void {
		if (!this.shouldLog()) return
		console.debug(`%c${this.formatMessage('debug', message)}`, levelStyles.debug, ...optional)
	}

	// =========================================================================
	// LOG POR TAG (TIPADO + AUTO INIT)
	// =========================================================================
	infoTag(tag: LogTag, message: string, ...optional: unknown[]): void {
		this.initIfNeeded()
		if (!this.shouldLog()) return

		const style = tagStyles[tag] ?? levelStyles.info
		console.log(`%c${this.formatMessage('info', `[${tag}] ${message}`)}`, style, ...optional)
	}

	warnTag(tag: LogTag, message: string, ...optional: unknown[]): void {
		this.initIfNeeded()
		if (!this.shouldLog()) return

		const style = tagStyles[tag] ?? levelStyles.warn
		console.warn(`%c${this.formatMessage('warn', `[${tag}] ${message}`)}`, style, ...optional)
	}

	errorTag(tag: LogTag, message: string | Error, ...optional: unknown[]): void {
		this.initIfNeeded()
		if (!this.shouldLog()) return

		const style = tagStyles[tag] ?? levelStyles.error
		const msg = message instanceof Error ? message.message : message

		console.error(`%c${this.formatMessage('error', `[${tag}] ${msg}`)}`, style, ...(message instanceof Error ? [message.stack, ...optional] : optional))
	}
}

const logger = new Logger()
export default logger
