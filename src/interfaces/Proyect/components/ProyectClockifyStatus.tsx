// components/ProyectClockifyStatus.tsx

import { FC } from 'react'
import { ProjectIntakeRecordDto } from '../models/ProyectDTO.m'

interface Props {
	project: ProjectIntakeRecordDto
}

export const ProyectClockifyStatus: FC<Props> = ({ project }) => {
	const isLinked = Boolean(project.ClockifyRecordId)

	return (
		<div className={`clockify-status ${isLinked ? 'is-linked' : 'is-unlinked'}`}>
			<span className="material-icons">{isLinked ? 'check_circle' : 'cancel'}</span>

			<div className="clockify-status__content">
				<strong>{isLinked ? 'Vinculado a Clockify' : 'No vinculado a Clockify'}</strong>

				{isLinked && project.ClockifyProjectName && <span className="clockify-status__detail">{project.ClockifyProjectName}</span>}
			</div>
		</div>
	)
}
