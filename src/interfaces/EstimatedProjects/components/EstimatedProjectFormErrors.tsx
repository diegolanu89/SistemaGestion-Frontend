import { FC } from 'react'
import { ValidateCapacityErrorDto } from '../../Capacity/model/CapacityDto.m'

interface Props {
	validationErrors: ValidateCapacityErrorDto[]
	submitError: string | null
}

export const EstimatedProjectFormErrors: FC<Props> = ({ validationErrors, submitError }) => {
	return (
		<>
			{validationErrors.length > 0 && (
				<div className="estimated-project-form__errors">
					<h4>No se puede guardar — el back rechazó la capacidad:</h4>

					<ul>
						{validationErrors.map((err, idx) => (
							<li key={`${err.user_name}-${err.month_key}-${idx}`}>{err.message}</li>
						))}
					</ul>
				</div>
			)}

			{submitError && <div className="estimated-project-form__errors">{submitError}</div>}
		</>
	)
}
