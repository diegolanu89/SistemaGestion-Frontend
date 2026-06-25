// components/ProyectTimesheetStatus.tsx

import { FC } from 'react'
import { ProjectIntakeRecordDto } from '../models/ProyectDTO.m'

interface Props {
	project: ProjectIntakeRecordDto
}

export const ProyectTimesheetStatus: FC<Props> = ({ project }) => {
	const isLinked = Boolean(project.TimesheetRecordId)

	return (
		<div className={`timesheet-status ${isLinked ? 'is-linked' : 'is-unlinked'}`}>
			<span className="material-icons">{isLinked ? 'check_circle' : 'cancel'}</span>

			<div className="timesheet-status__content">
				<strong>{isLinked ? 'Vinculado a Clockify' : 'No vinculado a Clockify'}</strong>

				{isLinked && project.TimesheetProjectName && <span className="timesheet-status__detail">{project.TimesheetProjectName}</span>}
			</div>
		</div>
	)
}
