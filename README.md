# Up Agenda (Frontend)

Front de una agenda web pensada para organizar cursada, laburo y vida personal en un solo lugar. Incluye login, registro, panel con dashboard, calendario semanal/diario/mensual y módulos de eventos, categorías, amigos, grupos y notificaciones.

La idea es simple: entras, ves tu semana, cargás eventos y te ordenás rápido. Hay un modo demo para mostrar todo con data de ejemplo mientras el backend se termina.

## Stack
- React + Vite
- React Router
- CSS puro

## Estructura (MVC)
- Model: `src/data`, `src/services`
- View: `src/pages`, `src/components`, `src/App.css`
- Controller: `src/hooks`, `src/utils`, `src/services`

## Variables de entorno
Usa un `.env` con la URL base del backend.

| Variable | Descripción | Ejemplo |
| --- | --- | --- |
| `VITE_API_URL` | URL base de la API | `https://TU-BACKEND.onrender.com` |

Tenés un ejemplo listo en `.env.example`.

## Instalación y ejecución
1. `npm install`
2. Copiá `.env.example` a `.env` y completá la URL de tu API
3. `npm run dev`

Otros comandos:
- `npm run build`
- `npm run preview`

## Conexión con el backend
Todas las requests salen desde `src/services/api.js` usando `VITE_API_URL`.
Si tu backend usa prefijo `/api`, ponelo directo en la variable:

```env
VITE_API_URL=https://TU-BACKEND.onrender.com/api
```

El login guarda `token` y `user` en `localStorage`. El resto de las pantallas consumen la API con `Authorization: Bearer <token>`.

## Ejemplos de requests

Login:
```bash
curl -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@agenda.com","password":"12345678"}'
```

Listar eventos:
```bash
curl -X GET "$API_URL/events" \
  -H "Authorization: Bearer $TOKEN"
```

Crear evento:
```bash
curl -X POST "$API_URL/events" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Clase React","startAt":"2026-03-02T09:30:00","categoryId":"cat-1"}'
```

Listar categorías:
```bash
curl -X GET "$API_URL/categories" \
  -H "Authorization: Bearer $TOKEN"
```

Resumen del dashboard:
```bash
curl -X GET "$API_URL/dashboard/summary" \
  -H "Authorization: Bearer $TOKEN"
```

## Colección de pruebas
Incluida en:
`docs/UpAgenda.postman_collection.json`

Importás esa colección en Postman o Thunder Client, seteás `baseUrl` y listo.

## Deploy
Probado para Vercel, Render o Railway.

Datos típicos:
- Build: `npm run build`
- Output: `dist`
- Variable de entorno: `VITE_API_URL`

URL de producción (completalo con tu deploy):
`https://TU-FRONTEND.vercel.app`

## Modo demo
El botón “Probar demo” habilita un token local (`demo-token`) y carga data de ejemplo desde `src/data/datosDemo.js`. Es solo para mostrar el diseño y el flujo mientras el backend está en progreso.
