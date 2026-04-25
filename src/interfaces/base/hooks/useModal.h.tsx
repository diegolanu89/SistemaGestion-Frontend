import { createContext, useContext } from 'react'
import { IModalContext } from '../model/IModalContext.m'

/**
 * Contexto global para el manejo de modales dentro de la aplicación.
 *
 * Este contexto permite que cualquier componente hijo de un `ModalProvider`
 * acceda al estado y las funciones para abrir, cerrar o configurar un modal
 * sin necesidad de pasar props manualmente a través de la jerarquía de componentes.
 *
 * @type {React.Context<IModalContext | null>}
 *
 * @example
 * ```tsx
 * import { modalContext } from './context/modalContext'
 * import { useState } from 'react'
 *
 * export const ModalProvider = ({ children }) => {
 *   const [isOpen, setIsOpen] = useState(false)
 *
 *   const openModal = () => setIsOpen(true)
 *   const closeModal = () => setIsOpen(false)
 *
 *   const value = { isOpen, openModal, closeModal }
 *
 *   return (
 *     <modalContext.Provider value={value}>
 *       {children}
 *     </modalContext.Provider>
 *   )
 * }
 * ```
 */
export const modalContext = createContext<IModalContext | null>(null)

/**
 * Hook personalizado que permite acceder fácilmente al contexto del modal.
 *
 * Debe ser utilizado únicamente dentro de un componente envuelto por `ModalProvider`.
 * Si se invoca fuera de dicho proveedor, lanzará un error descriptivo para
 * prevenir el uso incorrecto.
 *
 * @function useModal
 * @returns {IModalContext} El objeto de contexto que contiene el estado y las funciones
 * para manejar la apertura y cierre de modales.
 *
 * @throws {Error} Si se intenta usar fuera de un `ModalProvider`.
 *
 * @example
 * ```tsx
 * import { useModal } from './context/modalContext'
 *
 * const ExampleComponent = () => {
 *   const { isOpen, openModal, closeModal } = useModal()
 *
 *   return (
 *     <>
 *       <button onClick={openModal}>Abrir modal</button>
 *       {isOpen && (
 *         <div className="modal">
 *           <p>Contenido del modal</p>
 *           <button onClick={closeModal}>Cerrar</button>
 *         </div>
 *       )}
 *     </>
 *   )
 * }
 * ```
 */
export const useModal = (): IModalContext => {
	const context = useContext(modalContext)
	if (!context) {
		throw new Error('useModal debe ser utilizado dentro de un ModalProvider')
	}
	return context
}
