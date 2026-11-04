# ¿Y dónde está mi bondiolita? 🚍

Mapa en tiempo real de los colectivos de la Ciudad de Buenos Aires: muestra la posición de cada unidad, su línea y su destino, y se actualiza automáticamente cada 30 segundos.

**Demo:** https://y-donde-esta-mi-bondiolita.vercel.app/

## Arquitectura

- **Backend** (`backend/`): API en Node.js + Express que consulta la API de Transporte del GCBA (posiciones de vehículos en tiempo real) y expone los datos normalizados en `GET /api/bondis`. Deployado en Render.
- **Frontend** (`frontend/`): app en React + Leaflet (react-leaflet) que dibuja los colectivos sobre un mapa de OpenStreetMap. Deployado en Vercel.

## Correr localmente

Backend (requiere credenciales gratuitas de la API de Transporte):

```bash
cd backend
echo "CLIENT_ID=tu_client_id" > .env
echo "CLIENT_SECRET=tu_client_secret" >> .env
npm install
npm start
```

Frontend:

```bash
cd frontend
npm install
npm start
```
