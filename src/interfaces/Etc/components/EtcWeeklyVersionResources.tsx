// components/EtcWeeklyVersionResources.tsx

import { FC } from 'react'

import type { UserRefDto } from '../../EstimatedProjects/models/EstimatedProjectDTO.m'

interface Props {
	users: UserRefDto[]
	selectedUserIds: Set<number>
	search: string
	onSearch: (value: string) => void
	onToggleUser: (userId: number) => void
}

export const EtcWeeklyVersionResources: FC<Props> = ({ users, selectedUserIds, search, onSearch, onToggleUser }) => {
	return (
		<section className="etc-weekly-users">
			<div className="etc-weekly-users__search">
				<span className="material-icons">search</span>

				<input type="text" value={search} placeholder="Buscar usuario..." onChange={(e) => onSearch(e.target.value)} />
			</div>

			<div className="etc-weekly-users__grid">
				{users.map((u) => {
					const checked = selectedUserIds.has(u.Id)

					return (
						<label key={u.Id} className={`etc-weekly-user ${checked ? 'is-selected' : ''}`}>
							<input type="checkbox" checked={checked} onChange={() => onToggleUser(u.Id)} />

							<span>{u.FullName}</span>
						</label>
					)
				})}
			</div>
		</section>
	)
}
