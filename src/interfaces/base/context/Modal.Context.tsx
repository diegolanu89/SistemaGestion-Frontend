import { useState } from 'react'
import { IProviderModalProps } from '../model/IProviderModalProps.m'
import { modalContext } from '../hooks/useModal.h'

export const ModalProvider = ({ children }: IProviderModalProps) => {
	const [perfil, _onPerfil] = useState<boolean>(false)

	const onPerfil = () => {
		_onPerfil(!perfil)
	}

	return <modalContext.Provider value={{ perfil, onPerfil }}>{children}</modalContext.Provider>
}
