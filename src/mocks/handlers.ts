import { http, HttpResponse } from "msw";

/**
 * Lista de handlers para interceptar llamadas HTTP en entorno de pruebas.
 *
 * @constant
 * @type {Array<import('msw').HttpHandler>}
 *
 * @description
 * Este handler intercepta solicitudes GET al endpoint `/api/users` y devuelve
 * una respuesta simulada con un mensaje y estado HTTP personalizado.
 *
 * @example
 * // Al hacer una solicitud GET a /api/users, se recibe:
 * // {
 * //   message: "Mocked response"
 * // }
 * // con status 202 y statusText "Mocked status"
 */
export const handlers = [
  http.get("/api/users", () => {
    return HttpResponse.json(
      { message: "Mocked response" },
      { status: 202, statusText: "Mocked status" }
    );
  }),
];
