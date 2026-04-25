import { IAppBar } from '../types/IAppBar'
import { APPBAR_TITLES } from '../models/AppBartitle.m'

type RuntimeDeps = {
	setAnchorEl: (el: HTMLElement | null) => void
	navigate: (path: string) => void
	logout: () => Promise<void>
	onPerfil: () => void
}

export class AppBarController {
	private config: IAppBar
	private runtime!: RuntimeDeps
	private anchorEl: HTMLElement | null = null

	constructor(config: IAppBar) {
		this.config = config
	}

	bindRuntime(deps: RuntimeDeps) {
		this.runtime = deps
	}

	getTextColor(): string {
		return this.config.COLORS.TEXT
	}

	getLabels() {
		return this.config.LABELS
	}

	getSessionTimeout() {
		return this.config.SESSION.TIMEOUT_MS
	}

	getMenuState() {
		return {
			anchorEl: this.anchorEl,
		}
	}

	shouldShowBackButton(pathname: string): boolean {
		return !this.config.ROUTES.NO_BACK.includes(pathname)
	}

	getTitle(pathname: string): string {
		return APPBAR_TITLES[pathname] ?? this.config.TITLE
	}

	openMenu = (e: React.MouseEvent<HTMLElement>) => {
		this.anchorEl = e.currentTarget
		this.runtime.setAnchorEl(this.anchorEl)
	}

	closeMenu = () => {
		this.anchorEl = null
		this.runtime.setAnchorEl(null)
	}

	goHome = () => {
		this.closeMenu()
		this.runtime.navigate(this.config.ROUTES.HOME)
	}

	openProfile = () => {
		this.closeMenu()
		this.runtime.onPerfil()
	}

	logout = async () => {
		this.closeMenu()
		await this.runtime.logout()
	}
}
