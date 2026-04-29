export const PROYECT_CONFIG = {
	// ==========================
	// 🔹 TEXTOS
	// ==========================
	TEXTS: {
		TITLE: 'Proyectos',
		DESCRIPTION: 'Explorá, filtrá y gestioná los proyectos disponibles',
		SEARCH_LABEL: 'Buscar',
		SEARCH_PLACEHOLDER: 'Buscar proyecto...',
		EMPTY: 'No hay resultados',
	},

	// ==========================
	// 🔹 ICONOS
	// ==========================
	ICONS: {
		SEARCH: 'search',
		STATUS: 'flag',
		CATEGORY: 'category',
		TYPE: 'tune',
	},

	// ==========================
	// 🔹 FILTERS (SOLO UI 🔥)
	// ==========================
	FILTERS: {
		STATUS: {
			LABEL: 'Estado',
			TOOLTIP: 'Filtra los proyectos según su estado actual',
			ALL_OPTION: { value: 'all', label: 'Todos' },
		},
		CATEGORY: {
			LABEL: 'Categoría',
			TOOLTIP: 'Permite segmentar los proyectos por tipo de origen',
			ALL_OPTION: { value: 'all', label: 'Todas' },
		},
		TYPE: {
			LABEL: 'Tipo',
			TOOLTIP: 'Define el tipo de gestión aplicada al proyecto',
			ALL_OPTION: { value: 'all', label: 'Todos' },
		},
	},

	// ==========================
	// 🔹 TABLE
	// ==========================
	TABLE: {
		HEADERS: ['Título', 'Descripción', 'Estado', 'Categoría', 'Tipo'],

		ACTIONS: {
			EDIT_ICON: 'edit',
			DELETE_ICON: 'delete',
			EDIT_TOOLTIP: 'Editar proyecto',
			DELETE_TOOLTIP: 'Eliminar proyecto',
		},
	},

	// ==========================
	// 🔹 ACCIONES
	// ==========================
	ACTIONS: {
		ADD_ICON: 'add',
		ADD_LABEL: 'Agregar',
		ADD_TOOLTIP: 'Crear nuevo proyecto',

		REFRESH_ICON: 'refresh',
		REFRESH_TOOLTIP: 'Actualizar proyectos',

		// ✅ AGREGADO (para modal create)
		CANCEL: {
			LABEL: 'Cancelar',
			TOOLTIP: 'Cerrar el formulario sin guardar',
		},
		CONFIRM: {
			LABEL: 'Crear proyecto',
			TOOLTIP: 'Crear el proyecto con los datos ingresados',
		},
	},

	// ==========================
	// 🔹 CREATE PROJECT (MODAL + FORM)
	// ==========================
	CREATE: {
		CLOCKIFY: {
			TITLE: 'Clockify',
			DESCRIPTION: 'Crear automáticamente el proyecto en Clockify',
			ICON: 'schedule',
			TOOLTIP: 'Si está activo, el proyecto se creará también en Clockify',
		},

		FIELDS: {
			PROJECT_TYPE: {
				LABEL: 'Tipo de proyecto',
				ICON: 'tune',
				REQUIRED: true,
			},
			PROJECT_NAME: {
				LABEL: 'Nombre del proyecto',
				ICON: 'work',
				REQUIRED: true,
			},
			SECONDARY_NUMBER: {
				LABEL: 'N° Proyecto comercial',
				ICON: 'badge',
			},
			REGISTRATION_DATE: {
				LABEL: 'Fecha de alta',
				ICON: 'event',
			},
			CATEGORY: {
				LABEL: 'Categoría',
				ICON: 'category',
			},
			STATUS: {
				LABEL: 'Estado',
				ICON: 'flag',
			},
			OBSERVATIONS: {
				LABEL: 'Observaciones',
				ICON: 'notes',
			},
		},

		PLACEHOLDERS: {
			SELECT: 'Seleccionar…',
			EMPTY: '—',
		},

		MODAL: {
			TITLE: 'Nuevo Proyecto',
			ICON: 'add_box',

			// ✅ AGREGADOS
			CLOSE_ARIA_LABEL: 'Cerrar modal de creación de proyecto',
			CLOSE_TOOLTIP: 'Cerrar',
		},
	},

	// ==========================
	// 🔹 SEARCH
	// ==========================
	SEARCH: {
		DEBOUNCE_MS: 300,
	},

	// ==========================
	// 🔹 CACHE
	// ==========================
	CACHE: {
		KEYS: {
			PROJECTS: 'proyects_cache',
			REFS: 'proyect_refs_cache',
		},
		TTL: 1000 * 60 * 5, // 5 min
	},
}
