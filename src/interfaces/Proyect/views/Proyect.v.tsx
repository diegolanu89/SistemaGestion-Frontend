// views/Proyect.tsx
import { FC } from 'react'
import { ProyectTable } from '../components/ProyectTable'
import { ProyectFilters } from '../components/ProyectFilter'
import { ProyectHeader } from '../components/ProyectHeader'

export const Proyect: FC = () => {
	const handleAdd = () => {
		console.log('add proyect')
	}

	return (
		<div className="proyect">
			<ProyectHeader onAdd={handleAdd} />

			<section className="proyect__filters">
				<ProyectFilters />
			</section>

			<ProyectTable />
		</div>
	)
}

export default Proyect
