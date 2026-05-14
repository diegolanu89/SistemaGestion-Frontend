import { FC } from 'react'

interface Props {
	title: string
	backLabel: string
	backTooltip: string
	onBack: () => void
}

export const EstimatedProjectFormHeader: FC<Props> = ({ title, backLabel, backTooltip, onBack }) => {
	return (
		<header className="estimated-project-form__header">
			<button type="button" className="estimated-project-form__back" onClick={onBack} data-tooltip={backTooltip}>
				{backLabel}
			</button>

			<h2 className="estimated-project-form__title">{title}</h2>
		</header>
	)
}
