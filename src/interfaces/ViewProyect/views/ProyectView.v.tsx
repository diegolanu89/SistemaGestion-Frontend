import { FC, useEffect } from 'react'
import { ProyectViewFilters } from '../components/ProyectViewFilter'
import { ProyectGrid } from '../components/ProyectGrid'
import { ProyectPagination } from '../components/ProyectPagination'
import { ProyectViewAlert } from '../components/ProyectViewAlert'
import { SectionLoader } from '../../base/components/loading/SectionLoader'
import { useProyectViewContext } from '../hooks/useProyectViewContext.h'
import { useProyectViewController } from '../hooks/useProyectViewController.h'
import ProyectHeaderView from '../components/ProyectHeaderView'

export const ProyectView: FC = () => {
	const { loading, loadingText, setRefetch } = useProyectViewContext()
	const { fetchProjects } = useProyectViewController()

	useEffect(() => {
		setRefetch(() => fetchProjects)
	}, [fetchProjects, setRefetch])

	useEffect(() => {
		void fetchProjects()
	}, [fetchProjects])

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
