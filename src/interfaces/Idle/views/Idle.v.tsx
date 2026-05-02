import { memo } from 'react'
import FeatureGrid from '../components/FeatureGrid'

const Idle = memo(() => {
	return (
		<div className="idle">
			<FeatureGrid />

			<footer className="idle__footer">
				<strong>Sistema de Gestión de Proyectos</strong>
				<br />
				Desarrollado por Grupo 1 para BDT
				<br />© {new Date().getFullYear()} Grupo 1. Todos los derechos reservados.
			</footer>
		</div>
	)
})

export default Idle
