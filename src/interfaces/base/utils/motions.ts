import { motion } from 'framer-motion'
import type { ElementType } from 'react'

/**
 * Wrapper para elementos HTML (div, span, form, etc.)
 * Ej: motionCreate('div')
 */
export const motionCreate = <T extends keyof JSX.IntrinsicElements>(tag: T) => {
	return motion.create(tag)
}

/**
 * Wrapper para componentes React (MUI, propios, etc.)
 * Ej: component={motionMui(Card)}
 */
export const motionMui = <T extends ElementType>(component: T) => {
	return motion.create(component)
}

/**
 * Atajo estilo framer-motion v10 (m.div, m.img, etc.)
 */
export const myMotion = {
	div: motion.create('div'),
	img: motion.create('img'),
	span: motion.create('span'),
	form: motion.create('form'),
}
