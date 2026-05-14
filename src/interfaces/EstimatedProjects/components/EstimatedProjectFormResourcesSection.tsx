import { FC } from 'react'
import { ESTIMATED_PROJECT_CONFIG } from '../models/EstimatedProjectConfig.m'
import { UserRefDto } from '../../Users/model/UserRefDTO.m'

interface Props {
	filteredUsers: UserRefDto[]
	selectedUserIds: Set<number>
	userSearch: string
	selectedCount: number
	toggleAllLabel: string
	onSearchChange: (value: string) => void
	onToggleUser: (userId: number) => void
	onToggleAllVisible: () => void
}

export const EstimatedProjectFormResourcesSection: FC<Props> = ({
	filteredUsers,
	selectedUserIds,
	userSearch,
	selectedCount,
	toggleAllLabel,
	onSearchChange,
	onToggleUser,
	onToggleAllVisible,
}) => {
	const { FORM } = ESTIMATED_PROJECT_CONFIG

	return (
		<section className="estimated-project-form__resources">
			<label className="estimated-project-form__label">{FORM.FIELDS.RESOURCES.LABEL} *</label>

			<div className="estimated-project-form__resources-search">
				<span className="material-icons">search</span>

				<input
					className="estimated-project-form__input"
					placeholder={FORM.FIELDS.RESOURCES.SEARCH_PLACEHOLDER}
					value={userSearch}
					onChange={(e) => onSearchChange(e.target.value)}
				/>
			</div>

			<div className="estimated-project-form__resources-actions">
				<button type="button" className="estimated-project-form__btn-ghost" onClick={onToggleAllVisible}>
					{toggleAllLabel}
				</button>

				<span className="estimated-project-form__count">{selectedCount} seleccionados</span>
			</div>

			<div className="estimated-project-form__user-grid">
				{filteredUsers.map((u) => {
					const checked = selectedUserIds.has(u.Id)

					return (
						<label key={u.Id} className={`estimated-project-form__user ${checked ? 'is-checked' : ''}`}>
							<input type="checkbox" checked={checked} onChange={() => onToggleUser(u.Id)} />

							<span className="estimated-project-form__user-name">{u.FullName}</span>
						</label>
					)
				})}

				{filteredUsers.length === 0 && <div className="estimated-project-form__empty">Sin resultados</div>}
			</div>
		</section>
	)
}
