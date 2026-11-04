# ¿Y dónde está mi bondiolita?

Real-time map of Buenos Aires city buses. It shows where each bus is, its line and its destination, and refreshes every 30 seconds.

**Live demo:** https://y-donde-esta-mi-bondiolita.vercel.app/

## Architecture

- **Backend** (`backend/`): Node.js + Express API that queries the Buenos Aires City Transport API (real-time vehicle positions) and exposes the normalized data at `GET /api/bondis`. Deployed on Render.
- **Frontend** (`frontend/`): React + Leaflet (react-leaflet) app that draws the buses on an OpenStreetMap map. Each line and direction gets its own color, and positions older than a few minutes are marked as outdated. Deployed on Vercel.

## Run locally

Backend (requires free credentials for the city's Transport API):

```bash
cd backend
echo "CLIENT_ID=your_client_id" > .env
echo "CLIENT_SECRET=your_client_secret" >> .env
npm install
npm start
```

Frontend:

```bash
cd frontend
npm install
npm start
```

## Tests

```bash
cd frontend
npm test
```
