import { FC } from 'react'
import { ProyectViewFilters } from '../components/ProyectViewFilter'
import { ProyectGrid } from '../components/ProyectGrid'
import { ProyectPagination } from '../components/ProyectPagination'
import { ProyectViewAlert } from '../components/ProyectViewAlert'
import { SectionLoader } from '../../base/components/loading/SectionLoader'
import { useProyectViewContext } from '../hooks/useProyectViewContext.h'

export const ProyectView: FC = () => {
	const { loading } = useProyectViewContext()

	return (
		<div className="proyect-container">
			<ProyectViewAlert />

			<ProyectViewFilters />

			<div className="proyect-view__body">
				<ProyectGrid />

				{loading && <SectionLoader text="Cargando proyectos…" />}
			</div>

			<ProyectPagination />
		</div>
	)
}

export default ProyectView
