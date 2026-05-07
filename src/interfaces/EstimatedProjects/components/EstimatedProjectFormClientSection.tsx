import { Dispatch, FC, SetStateAction } from 'react'
import { ClientRefDto } from '../models/EstimatedProjectDTO.m'
import { ESTIMATED_PROJECT_CONFIG } from '../models/EstimatedProjectConfig.m'
import { MonthlyHoursState } from './EstimatedProjectMonthlyGrid'

export interface EstimatedProjectFormState {
	clientId: string
	newClientName: string
	projectName: string
	code: string
	selectedUserIds: Set<number>
	monthCount: number
	monthlyHours: MonthlyHoursState
	anchorMonth: string
}

interface Props {
	form: EstimatedProjectFormState
	setForm: Dispatch<SetStateAction<EstimatedProjectFormState>>
	clients?: ClientRefDto[]
	loadingRefs: boolean
}

export const EstimatedProjectFormClientSection: FC<Props> = ({ form, setForm, clients, loadingRefs }) => {
	const { FORM } = ESTIMATED_PROJECT_CONFIG

	return (
		<div className="estimated-project-form__grid">
			<div className="estimated-project-form__field">
				<label className="estimated-project-form__label">{FORM.FIELDS.CLIENT.LABEL} *</label>

				<select
					className="estimated-project-form__select"
					value={form.clientId}
					onChange={(e) => setForm((prev) => ({ ...prev, clientId: e.target.value, newClientName: '' }))}
					disabled={loadingRefs}
				>
					<option value="">{FORM.FIELDS.CLIENT.PLACEHOLDER_SELECT}</option>

					{clients?.map((c) => (
						<option key={c.Id} value={c.Id}>
							{c.Name}
						</option>
					))}
				</select>

				<input
					className="estimated-project-form__input estimated-project-form__input--secondary"
					placeholder={FORM.FIELDS.CLIENT.PLACEHOLDER_NEW}
					value={form.newClientName}
					onChange={(e) => setForm((prev) => ({ ...prev, newClientName: e.target.value, clientId: '' }))}
				/>
			</div>

			<div className="estimated-project-form__field">
				<label className="estimated-project-form__label">{FORM.FIELDS.PROJECT_NAME.LABEL} *</label>

				<input
					className="estimated-project-form__input"
					placeholder={FORM.FIELDS.PROJECT_NAME.PLACEHOLDER}
					value={form.projectName}
					onChange={(e) => setForm((prev) => ({ ...prev, projectName: e.target.value }))}
					required
				/>
			</div>

			<div className="estimated-project-form__field">
				<label className="estimated-project-form__label">{FORM.FIELDS.CODE.LABEL}</label>

				<input
					className="estimated-project-form__input"
					placeholder={FORM.FIELDS.CODE.PLACEHOLDER}
					value={form.code}
					onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value }))}
				/>
			</div>
		</div>
	)
}
