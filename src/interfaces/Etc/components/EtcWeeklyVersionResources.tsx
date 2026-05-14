import { FC } from 'react'

import { useEtcWeeklyVersionController } from '../hooks/useEtcWeelyVersionController.h'

export const EtcWeeklyVersionResources: FC = () => {
	const { filteredUsers, selectedUserIds, search, setSearch, toggleUser } = useEtcWeeklyVersionController()

	return (
		<section className="etc-weekly-users">
			<div className="etc-weekly-users__search">
				<span className="material-icons">search</span>

				<input type="text" value={search} placeholder="Buscar usuario..." onChange={(e) => setSearch(e.target.value)} />
			</div>

			<div className="etc-weekly-users__grid">
				{filteredUsers.map((u) => {
					const checked = selectedUserIds.has(u.Id)

					return (
						<label key={u.Id} className={`etc-weekly-user ${checked ? 'is-selected' : ''}`}>
							<input type="checkbox" checked={checked} onChange={() => toggleUser(u.Id)} />

							<span>{u.FullName}</span>
						</label>
					)
				})}
			</div>
		</section>
	)
}
