import { FC } from 'react'
import { ProyectTable } from '../components/ProyectTable'
import { ProyectFilters } from '../components/ProyectFilter'
import { ProyectHeader } from '../components/ProyectHeader'
import { ProyectCreateModal } from '../components/ProyectCreateModal'
import { ProyectEditModal } from '../components/ProyectEditModal'
import { ProyectDeleteModal } from '../components/ProyectDeleteModal'
import { useProyectContext } from '../hooks/useProyectContext.h'

export const Proyect: FC = () => {
	const { isCreateOpen, isEditOpen, isDeleteOpen } = useProyectContext()

	return (
		<div className="proyect">
			<ProyectHeader />

			<section className="proyect__filters">
				<ProyectFilters />
			</section>

			<ProyectTable />

			{isCreateOpen && <ProyectCreateModal />}
			{isEditOpen && <ProyectEditModal />}
			{isDeleteOpen && <ProyectDeleteModal />}
		</div>
	)
}

export default Proyect
