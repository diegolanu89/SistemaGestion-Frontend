import { FC } from 'react'

interface SectionLoaderProps {
	text?: string
}

export const SectionLoader: FC<SectionLoaderProps> = ({ text = 'Cargando…' }) => {
	return (
		<div className="section-loader">
			<div className="spinner" />
			<span>{text}</span>
		</div>
	)
}
