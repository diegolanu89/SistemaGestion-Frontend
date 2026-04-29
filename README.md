## 🛠️ Tecnologías Utilizadas

| Tecnología                                                                                                      | Uso Principal                            |
| --------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| ![React](https://img.shields.io/badge/-React-20232A?logo=react&logoColor=61DAFB)                                | Librería principal de UI                 |
| ![Vite](https://img.shields.io/badge/-Vite-646CFF?logo=vite&logoColor=FFD62E)                                   | Bundler ultrarrápido para desarrollo     |
| ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=fff)                    | Tipado fuerte en todo el proyecto        |
| ![Sass](https://img.shields.io/badge/-Sass-CC6699?logo=sass&logoColor=white)                                    | Preprocesador CSS para estilos avanzados |
| ![Material UI Icons](https://img.shields.io/badge/-Material%20Icons-757575?logo=materialdesign&logoColor=white) | Sistema de iconografía                   |
| ![React Router](https://img.shields.io/badge/-React%20Router-CA4245?logo=reactrouter&logoColor=white)           | Navegación y rutas                       |
| ![Framer Motion](https://img.shields.io/badge/-Framer%20Motion-0055FF?logo=framer&logoColor=white)              | Animaciones UI                           |
| ![Vitest](https://img.shields.io/badge/-Vitest-6E9F18?logo=vitest&logoColor=white)                              | Tests unitarios                          |
| ![Cypress](https://img.shields.io/badge/-Cypress-17202C?logo=cypress&logoColor=white)                           | Tests end-to-end                         |
| ![GitHub Actions](https://img.shields.io/badge/-CI/CD-2088FF?logo=githubactions&logoColor=white)                | Automatización de deploys                |
| ![Docker](https://img.shields.io/badge/-Docker-2496ED?logo=docker&logoColor=white)                              | Contenedorización del frontend           |

---

## Variables de ambiente

El archivo `.env` en la raíz del proyecto controla tanto el comportamiento local como el build de Docker.

```env
# URL del backend .NET
VITE_API_URL=http://localhost:5000/api

# URL usada por docker compose al buildear
VITE_API_URL_DOCKER=http://localhost:5000/api

# Modo de autenticación: ers (backend real) | MOCK (datos simulados)
VITE_AUTH_PROVIDER=ers
VITE_APP_MODE=ers

VITE_ENV=production
```

> **Importante:** los valores `ers` y `mock` son case-sensitive. El enum interno usa `'ers'` y `'mock'` en minúscula para el modo real y para el simulado.

### Alternancia entre modos

| Modo                | `VITE_APP_MODE` | `VITE_AUTH_PROVIDER` | Descripción                            |
| ------------------- | --------------- | -------------------- | -------------------------------------- |
| Real (backend .NET) | `ers`           | `ers`                | Llama a la API en `VITE_API_URL`       |
| Mock (sin backend)  | `mock`          | `mock`               | Credenciales: `demo@mock.com` / `1234` |

---

## 🔁 Instalación Local

```bash
yarn install
yarn dev
```

## Docker

El frontend se expone en `localhost:3001` y se comunica con el backend directamente desde el browser en `localhost:5000`.

```bash
docker compose up --build
```

### Arquitectura Docker

```
Browser → http://localhost:3001  →  nginx (contenedor)  →  sirve archivos estáticos del SPA
Browser → http://localhost:5000  →  backend .NET (host)  →  API REST
```

Las variables de entorno se embeben en el build de Vite mediante build args del Dockerfile. Cambiar el `.env` requiere rebuildar la imagen con `--build`.

### Agregar una nueva variable

Cada `VITE_*` nueva requiere tres pasos:

1. **`.env`** — agregar el valor
2. **`Dockerfile`** — declarar `ARG` (para recibirla de Docker Compose) y `ENV` (para que Vite la lea durante el build)
3. **`docker-compose.yml`** — pasarla como arg usando `${NOMBRE_VARIABLE}`

> Si la cantidad de variables crece, conviene reemplazar este patrón por un archivo `.env.docker` commiteado que el Dockerfile use directamente, evitando declarar cada variable por separado.

---

> ### ℹ️ **Estilos (SCSS)**
>
> Este proyecto utiliza **SCSS** como fuente de estilos.  
> Los archivos CSS dentro de `src/css` **NO se commitean** porque son **generados automáticamente por Sass** durante el desarrollo y el build.
>
> ✅ Editar y versionar solo archivos `.scss`  
> ❌ No modificar ni commitear CSS generado
> ``
