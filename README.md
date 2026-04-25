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

```env
frontend/
│
├── env/
│   ├── .env.development
│   └── .env.production
```

#### ENV development

```env
VITE_API_URL=http://localhost:3001
VITE_AUTH_PROVIDER=MOCK
VITE_APP_MODE=MOCK
VITE_ENV=development
```

### ENV production

```env
VITE_API_URL=http://backend:3001
VITE_AUTH_PROVIDER=ERS
VITE_APP_MODE=ERS
VITE_ENV=production
```

## 🔁 Alternancia entre Backends/App

```env
VITE_AUTH_PROVIDER=MOCK
VITE_APP_MODE=MOCK
# o
VITE_AUTH_PROVIDER=ERS
VITE_APP_MODE=ERS
```

---

## 🔁 Instalación Local

```env
yarn install
yarn dev
```

## Docker

```env
docker build -t my-frontend .
docker run -p 8080:80 my-frontend
```
