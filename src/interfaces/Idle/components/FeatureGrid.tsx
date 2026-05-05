/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { useCapabilities } from '../../base/context/Capabilities.Context'
import { SIDEBAR } from '../../SideBar/models/SideBarConfig.m'

const STORAGE_KEY = 'feature_usage'

type UsageMap = Record<string, number>

type ActionItem = {
	label: string
	icon: string
	path: string
	section: string
	roles?: string[]
	disabled?: boolean
}

const getUsage = (): UsageMap => {
	try {
		return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
	} catch {
		return {}
	}
}

const setUsage = (usage: UsageMap): void => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(usage))
}

const flattenMenu = (): ActionItem[] => {
	return SIDEBAR.menu.flatMap((section) =>
		(section.children ?? [])
			.filter((child): child is typeof child & { path: string } => !!child.path)
			.map((child) => ({
				label: child.label,
				icon: child.icon ?? 'circle',
				path: child.path,
				section: section.label,
				roles: undefined,
				disabled: false,
			}))
	)
}

const FeatureGrid = () => {
	const navigate = useNavigate()
	const { role } = useCapabilities()

	const [usage, setUsageState] = useState<UsageMap>(() => getUsage())

	const allActions = useMemo(() => flattenMenu(), [])

	const filteredByRole = useMemo(() => {
		return allActions.map((action) => {
			const isAllowed = !action.roles || action.roles.includes(role)

			return {
				...action,
				disabled: !isAllowed,
			}
		})
	}, [allActions, role])

	const sorted = useMemo(() => {
		return [...filteredByRole].sort((a, b) => (usage[b.path] || 0) - (usage[a.path] || 0))
	}, [filteredByRole, usage])

	const topActions = sorted.slice(0, 4)
	const restActions = sorted.slice(4)

	const trackUsage = (path: string): void => {
		setUsageState((prev) => {
			const updated = {
				...prev,
				[path]: (prev[path] || 0) + 1,
			}
			setUsage(updated)
			return updated
		})
	}

	const handleClick = (action: ActionItem): void => {
		if (action.disabled) return

		trackUsage(action.path)
		navigate(action.path)
	}

	return (
		<div className="feature-grid-layout">
			<section className="feature-grid-box">
				<div className="feature-grid__top">
					{topActions.map((action) => (
						<button
							key={action.path}
							className={`feature-grid__top-card ${action.disabled ? 'is-disabled' : ''}`}
							onClick={() => handleClick(action)}
							disabled={action.disabled}
						>
							<span className="material-icons feature-grid__top-icon">{action.icon}</span>

							<div className="feature-grid__top-content">
								<span className="feature-grid__top-title">{action.label}</span>
								<span className="feature-grid__top-desc">{action.section}</span>
							</div>
						</button>
					))}
				</div>

				<div className="feature-grid__grid">
					{restActions.map((action) => (
						<button
							key={action.path}
							className={`feature-grid__card ${action.disabled ? 'is-disabled' : ''}`}
							onClick={() => handleClick(action)}
							disabled={action.disabled}
						>
							<span className="material-icons feature-grid__icon">{action.icon}</span>

							<div className="feature-grid__content">
								<span className="feature-grid__title">{action.label}</span>
								<span className="feature-grid__desc">{action.section}</span>
							</div>
						</button>
					))}
				</div>
			</section>
		</div>
	)
}

export default FeatureGrid
