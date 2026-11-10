const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REQUEST_TIMEOUT_MS = Number(process.env.API_TIMEOUT_MS) || 10000;

const ROUTES = [283, 284, 287, 288, 496, 497, 922, 923, 924, 925, 926, 927, 1161, 1162, 1199, 1200, 1201];
const AGENCIES = [87, 83, 51];

async function obtenerUbicaciones() {
  const ubicaciones = [];

  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error("Faltan CLIENT_ID y/o CLIENT_SECRET en el archivo .env");
  }

  const url = `https://apitransporte.buenosaires.gob.ar/colectivos/vehiclePositionsSimple?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;

  try {
    const res = await axios.get(url, { timeout: REQUEST_TIMEOUT_MS });

    if (res.status === 200) {
      const data = res.data;

      if (Array.isArray(data) && data.length > 0) {
        data.forEach((item) => {

          // if (ROUTES.includes(Number(item.route_id)) || AGENCIES.includes(Number(item.agency_id))) {
          ubicaciones.push({
            route_short_name: item.route_short_name,
            agency_id: item.agency_id,
            latitude: item.latitude,
            longitude: item.longitude,
            timestamp: new Date(item.timestamp * 1000).toLocaleTimeString("en-US", { hourCycle: "h23", timeZone: "America/Argentina/Buenos_Aires" }),
            trip_headsign: item.trip_headsign,
          });
          // }
        });
      } else {
        console.log("[Aviso] No se encontraron vehículos.");
      }
    } else {
      console.log(`[Error] La API respondió con un error. Código: ${res.status}`);
    }
  } catch (error) {
    throw new Error(`Error al hacer la solicitud a la API: ${error.message}`);
  }

  return ubicaciones;
}

module.exports = { obtenerUbicaciones };
