export type Status = 'activo' | 'pausado' | 'finalizado'
export type Category = 'interno' | 'cliente' | 'innovacion'
export type Type = 'evm' | 'horas' | 'mixto'

export interface ProyectItem {
	id: string
	title: string
	description: string
	status: Status
	category: Category
	type: Type
}
