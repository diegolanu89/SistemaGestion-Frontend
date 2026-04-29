import { FC } from 'react'
import { ProyectTable } from '../components/ProyectTable'
import { ProyectFilters } from '../components/ProyectFilter'
import { ProyectHeader } from '../components/ProyectHeader'
import { ProyectCreateModal } from '../components/ProyectCreateModal'
import { useProyectContext } from '../hooks/useProyectContext.h'

export const Proyect: FC = () => {
	const { isCreateOpen } = useProyectContext()

	return (
		<div className="proyect">
			<ProyectHeader />

			<section className="proyect__filters">
				<ProyectFilters />
			</section>

			<ProyectTable />

			{/* 🔥 Modal controlado por Context */}
			{isCreateOpen && <ProyectCreateModal />}
		</div>
	)
}

export default Proyect
