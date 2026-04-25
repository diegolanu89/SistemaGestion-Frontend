/**
 * 📤 IUseAuthSubmitParams
 *
 * Interfaz que define los parámetros requeridos por funciones que manejan
 * el envío de formularios de autenticación (login y registro).
 *
 * Esta interfaz permite desacoplar la lógica de autenticación del componente
 * visual, facilitando la reutilización y testeo de la funcionalidad.
 */
export interface IUseAuthSubmitParams {
	/**
	 * 🔐 login
	 * Función de inicio de sesión que recibe email y contraseña.
	 *
	 * @param email - Correo electrónico del usuario.
	 * @param password - Contraseña del usuario.
	 * @returns {Promise<void>} Promesa que se resuelve al completar el login.
	 *
	 * @example
	 * await login("usuario@example.com", "password123");
	 */
	login: (email: string, password: string) => Promise<void>

	/**
	 * 📝 register
	 * Función de registro que recibe el usuario (email, nombre, id) y la contraseña.
	 *
	 * @param user - Objeto con los datos del nuevo usuario.
	 * @param password - Contraseña para el nuevo usuario.
	 * @returns {Promise<void>} Promesa que se resuelve al completar el registro.
	 *
	 * @example
	 * await register({ email: "nuevo@ejemplo.com", nombre: "Nuevo Usuario", id: "abc123" }, "password123");
	 */
	register: (email: string, password: string, name?: string) => Promise<void>

	/**
	 * 🚀 redirect
	 * Función que redirige a una ruta específica tras autenticación exitosa.
	 *
	 * @param path - Ruta a la que se debe redirigir.
	 *
	 * @example
	 * redirect("/dashboard");
	 */
	redirect: (path: string) => void
}
