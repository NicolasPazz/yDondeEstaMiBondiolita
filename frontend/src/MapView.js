import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { motion, AnimatePresence } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Icono personalizado para los bondis
const bondiIcon = new L.Icon({
    iconUrl: "/bus-icon.png",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
  

function MapView({ bondis }) {
  return (
    <MapContainer
      center={[-34.6037, -58.3816]} // CABA como centro inicial
      zoom={11}
      style={{ height: "90vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      <AnimatePresence>
        {bondis.map((bondi) => (
          <motion.div
            key={`${bondi.route_short_name}-${bondi.latitude}-${bondi.longitude}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Marker
              position={[bondi.latitude, bondi.longitude]}
              icon={bondiIcon}
            >
              <Popup>
                <strong>Línea:</strong> {bondi.route_short_name}
                <br />
                <strong>Destino:</strong> {bondi.trip_headsign}
                <br />
                <strong>Hora:</strong> {bondi.timestamp}
              </Popup>
            </Marker>
          </motion.div>
        ))}
      </AnimatePresence>
    </MapContainer>
  );
}

export default MapView;
