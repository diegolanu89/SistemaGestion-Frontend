// src/common/models/AvatarSrc.model.ts
import { Capacitor } from '@capacitor/core'
import { resolveCapabilities } from '../../base/model/ResolveCapabilities.m'

const isAndroid = Capacitor.getPlatform() === 'android'
const host = window.location.hostname
const protocol = window.location.protocol
const { isDev } = resolveCapabilities()

import tomato from '../../../images/avatars/tomato.png'
import doc from '../../../images/avatars/doc.png'
import apple from '../../../images/avatars/apple.png'
import bones from '../../../images/avatars/bones.png'
import hidrato from '../../../images/avatars/hidrato.png'
import burgo from '../../../images/avatars/burgo.png'

// 🌍 base real del frontend (web / android / ios)
const FRONT_BASE_URL = window.location.origin

// 🔙 base del backend
const BACKEND_BASE_URL = isDev ? (isAndroid ? 'http://10.0.2.2:3001' : `${protocol}//${host}:3001`) : 'https://tu-api.com'

export const AVATAR_MODEL = {
	// tipos
	BLOB_PREFIX: 'blob:',

	// rutas
	FRONT_AVATAR_PATH: '/avatars/',

	// legacy
	LEGACY_BACKEND_BASE: 'http://localhost:3001',

	FRONT_AVATARS: {
		'tomato.png': tomato,
		'doc.png': doc,
		'apple.png': apple,
		'bones.png': bones,
		'hidrato.png': hidrato,
		'burgo.png': burgo,
	},

	// bases
	FRONT_BASE_URL,
	BACKEND_BASE_URL,
}
