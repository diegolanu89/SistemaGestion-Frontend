// models/ProyectConfig.m.ts

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
