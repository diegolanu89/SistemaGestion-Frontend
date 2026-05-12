import { FC } from 'react'
import { ProyectViewFilters } from '../components/ProyectViewFilter'
import { ProyectGrid } from '../components/ProyectGrid'
import { ProyectPagination } from '../components/ProyectPagination'
import { ProyectViewAlert } from '../components/ProyectViewAlert'
import { SectionLoader } from '../../base/components/loading/SectionLoader'
import { useProyectViewContext } from '../hooks/useProyectViewContext.h'
import ProyectHeaderView from '../components/ProyectHeaderView'

export const ProyectView: FC = () => {
	const { loading, loadingText } = useProyectViewContext()

	return (
		<div className="proyect-container">
			<ProyectViewAlert />

			<div className="proyect-view__body">
				<div className="proyect-view__content">
					<ProyectHeaderView />

					<ProyectViewFilters />

					<ProyectGrid />
				</div>

				{loading && <SectionLoader text={loadingText} />}
			</div>

			<ProyectPagination />
		</div>
	)
}

export default ProyectView
