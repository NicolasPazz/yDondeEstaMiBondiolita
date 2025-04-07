const express = require("express");
const cors = require("cors");
const { obtenerUbicaciones } = require("./bondi_location_service");
const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send("<h1>🚍 API de Bondiolita funcionando correctamente</h1>");
});

app.get("/api/bondis", async (req, res) => {
  try {
    const ubicaciones = await obtenerUbicaciones();
    if (!ubicaciones || ubicaciones.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron bondis activos en este momento." });
    }
    return res.status(200).json(ubicaciones);
  } catch (error) {
    console.error("[Error] Error al obtener ubicaciones:", error);
    return res
      .status(500)
      .json({ message: "Hubo un problema al obtener las ubicaciones de los bondis." });
  }
});

app.get("/test", (req, res) => {
    res.json({ message: "Test OK" });
  });

const port = process.env.PORT || 5000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
