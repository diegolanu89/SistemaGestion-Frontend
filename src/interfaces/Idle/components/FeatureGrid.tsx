/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { SIDEBAR } from '../../SideBar/models/SideBarConfig.m'
import { useAuth } from '../../Login/hooks/useAuth.h'
import { PermissionController } from '../../base/controllers/PermissionController.c'

const STORAGE_KEY = 'feature_usage'

type UsageMap = Record<string, number>

type ActionItem = {
	label: string
	icon: string
	path: string
	section: string
	requiredPermission?: string
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
				requiredPermission: child.requiredPermission,
				disabled: false,
			}))
	)
}

const FeatureGrid = () => {
	const navigate = useNavigate()
	const { user } = useAuth()

	const [usage, setUsageState] = useState<UsageMap>(() => getUsage())

	const allActions = useMemo(() => flattenMenu(), [])

	const allowedActions = useMemo(() => {
		return allActions.filter((action) => PermissionController.hasPermission(user, action.requiredPermission))
	}, [allActions, user])

	const sorted = useMemo(() => {
		return [...allowedActions].sort((a, b) => (usage[b.path] || 0) - (usage[a.path] || 0))
	}, [allowedActions, usage])

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
