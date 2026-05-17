import { FC } from 'react'

import { useEstimatedProjectForm } from '../hooks/useEstimatedProjectForm.h'
import { EstimatedProjectFormHeader } from '../components/EstimatedProjectFormHeader'
import { EstimatedProjectFormClientSection } from '../components/EstimatedProjectFormClientSection'
import { EstimatedProjectFormResourcesSection } from '../components/EstimatedProjectFormResourcesSection'
import { EstimatedProjectFormErrors } from '../components/EstimatedProjectFormErrors'
import { EstimatedProjectFormActions } from '../components/EstimatedProjectFormActions'
import { EstimatedProjectMonthlyGrid } from '../components/EstimatedProjectMonthlyGrid'

export const EstimatedProjectCreate: FC = () => {
	const form = useEstimatedProjectForm()

	return (
		<form className="estimated-project-form" onSubmit={form.handleSubmit}>
			<EstimatedProjectFormHeader
				title={form.title}
				backLabel={form.FORM.BACK_LABEL}
				backTooltip={form.FORM.BACK_TOOLTIP}
				onBack={form.handleBack}
			/>

			<EstimatedProjectFormClientSection
				form={form.form}
				setForm={form.setForm}
				clients={form.refs?.clients}
				loadingRefs={form.loadingRefs}
			/>

			<EstimatedProjectFormResourcesSection
				filteredUsers={form.filteredUsers}
				selectedUserIds={form.form.selectedUserIds}
				userSearch={form.userSearch}
				selectedCount={form.form.selectedUserIds.size}
				toggleAllLabel={form.toggleAllLabel}
				onSearchChange={form.setUserSearch}
				onToggleUser={form.toggleUser}
				onToggleAllVisible={form.toggleAllVisible}
			/>

			<EstimatedProjectMonthlyGrid
				months={form.months}
				monthCount={form.form.monthCount}
				onMonthCountChange={form.setMonthCount}
				selectedUsers={form.selectedUsers}
				values={form.form.monthlyHours}
				onChange={form.updateHours}
				potencialProjectId={form.editingId}
			/>

			<EstimatedProjectFormErrors
				validationErrors={form.validationErrors}
				submitError={form.submitError}
			/>

			<EstimatedProjectFormActions
				canSubmit={form.canSubmit}
				submitting={form.submitting}
				onCancel={form.handleBack}
			/>
		</form>
	)
}

export default EstimatedProjectCreate