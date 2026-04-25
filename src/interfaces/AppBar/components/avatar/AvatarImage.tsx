// src/interfaces/AppBar/components/avatar/AvatarImage.tsx

import { useAvatarData } from '../../hook/useAvatarData.h'

const AvatarImage = () => {
	const { initials, bgColor } = useAvatarData()

	return (
		<div className="avatar" style={{ backgroundColor: bgColor }}>
			<span className="avatar__initials">{initials}</span>
		</div>
	)
}

export default AvatarImage
