// models/EstimatedProjectConfig.m.ts

export const ESTIMATED_PROJECT_CONFIG = {
	// ==========================
	// 🔹 TEXTOS
	// ==========================
	TEXTS: {
		TITLE: 'Alta de Proyectos Estimados',
		DESCRIPTION:
			'Clientes potenciales y proyectos estimados para planificar capacidad. Asigná horas por recurso y mes; luego se integran con el Dashboard de Horas.',
		EMPTY: 'No hay proyectos estimados cargados.',
		LOADING: 'Cargando proyectos estimados…',
	},

	// ==========================
	// 🔹 ICONOS
	// ==========================
	ICONS: {
		EXPAND: 'chevron_right',
		COLLAPSE: 'expand_more',
	},

	// ==========================
	// 🔹 TABLE
	// ==========================
	TABLE: {
		HEADERS: ['Cliente', 'Proyecto', 'Código', 'Total Horas', 'Total Recursos', 'Meses'],

		ACTIONS: {
			EDIT_LABEL: 'Editar',
			DELETE_LABEL: 'Borrar',
			EDIT_TOOLTIP: 'Editar proyecto estimado',
			DELETE_TOOLTIP: 'Eliminar proyecto estimado',
		},
	},

	// ==========================
	// 🔹 ACCIONES PÁGINA LISTA
	// ==========================
	ACTIONS: {
		ADD_ICON: 'add',
		ADD_LABEL: 'Agregar Proyecto',
		ADD_TOOLTIP: 'Crear nuevo proyecto estimado',
	},

	// ==========================
	// 🔹 CREATE / EDIT FORM
	// ==========================
	FORM: {
		BACK_LABEL: '← Volver',
		BACK_TOOLTIP: 'Volver al listado',

		TITLE_CREATE: 'Agregar Proyecto Estimado',
		TITLE_EDIT: 'Editar Proyecto Estimado',

		FIELDS: {
			CLIENT: {
				LABEL: 'Cliente',
				REQUIRED: true,
				PLACEHOLDER_SELECT: 'Cliente existente…',
				PLACEHOLDER_NEW: 'Nuevo cliente (nombre)',
			},
			PROJECT_NAME: {
				LABEL: 'Nombre del proyecto',
				REQUIRED: true,
				PLACEHOLDER: 'Ej: Proyecto X - Fase 1',
			},
			CODE: {
				LABEL: 'Código (opcional)',
				PLACEHOLDER: 'Ej: 30.099',
			},
			RESOURCES: {
				LABEL: 'Recursos (usuarios)',
				REQUIRED: true,
				SEARCH_PLACEHOLDER: 'Buscar usuario…',
				SELECT_ALL: 'Seleccionar todos',
				CLEAR_ALL: 'Limpiar selección',
			},
		},

		ACTIONS: {
			CANCEL: { LABEL: 'Cancelar', TOOLTIP: 'Cancelar y volver al listado' },
			CONFIRM: { LABEL: 'Guardar', TOOLTIP: 'Guardar proyecto estimado' },
		},
	},

	// ==========================
	// 🔹 CACHE
	// ==========================
	CACHE: {
		KEYS: {
			PROJECTS: 'estimated_projects_cache',
			REFS: 'estimated_projects_refs_cache',
		},
		TTL: 1000 * 60 * 5,
	},
}
