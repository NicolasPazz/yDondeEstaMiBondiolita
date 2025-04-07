import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

const stringToColor = (linea, direccion) => {
  const combinedString = linea + direccion;
  let hash = 0;
  for (let i = 0; i < combinedString.length; i++) {
    hash = combinedString.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash) % 360;
  const saturation = 70;
  const lightness = 50; 

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};


const createBondiIcon = (linea, direccion, isOutdated) => {
  const bgColor = stringToColor(linea, direccion);
  return L.divIcon({
    className: "bondi-icon",
    html: `
      <div class="bondi-icon-container">
        <div class="bondi-icon-label" style="background-color: ${bgColor};">
          ${linea}
        </div>
        <img src="/bus-icon.png" class="bondi-icon-img" />
        ${isOutdated ? '<img src="/clock-icon.png" class="bondi-icon-outdated" />' : ""}
      </div>
    `,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -45],
  });
};

function App() {
  const [bondis, setBondis] = useState([]);
  const [error, setError] = useState("");
  const [visibleLines, setVisibleLines] = useState({});
  const [searchLinea, setSearchLinea] = useState("");
  const lastClickTimeRef = useRef(null);

  useEffect(() => {
    const fetchBondis = () => {
      fetch("https://ydondeestamibondiolita.onrender.com/api/bondis")
        .then((res) => res.json())
        .then((data) => {
          if (data.message) {
            setError(data.message);
            setBondis([]);
          } else {
            setBondis(data);
            setError("");
          }
        })
        .catch(() => {
          setError("Hubo un problema al conectar con el servidor.");
          setBondis([]);
        });
    };

    fetchBondis();
    const interval = setInterval(fetchBondis, 30000);
    return () => clearInterval(interval);
  }, []);

  const isOutdated = (timestamp) => {
    const now = new Date();

    const timestampParts = timestamp.split(":");
    const hours = parseInt(timestampParts[0], 10);
    const minutes = parseInt(timestampParts[1], 10);

    const fullTimestamp = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0); 
    
    if (isNaN(fullTimestamp.getTime())) return true;  

    const timeDifferenceInMinutes = (now - fullTimestamp) / 1000 / 60;

    return timeDifferenceInMinutes > 5;  
};

  const handleCheckboxChange = (linea) => {
    setVisibleLines((prev) => ({
      ...prev,
      [linea]: !prev[linea],
    }));
  };

  const getUniqueLines = () => {
    return [...new Set(bondis.map((b) => b.route_short_name))];
  };

  const handleSelectAll = () => {
    const all = {};
    getUniqueLines().forEach((linea) => {
      all[linea] = true;
    });
    setVisibleLines(all);
  };

  const handleClearOrAgencyFilter = () => {
    const now = Date.now();
    const lastClickTime = lastClickTimeRef.current;
  
    const AGENCIES = [87, 83, 51, 11, 68, 127];
    const uniqueLines = getUniqueLines();
  
    if (lastClickTime && now - lastClickTime < 300) {
      console.log("Doble click detectado");
  
      lastClickTimeRef.current = 0;
  
      const visibles = {};
  
      bondis.forEach((bondi) => {
        if (Number.isFinite(Number(bondi.agency_id)) && AGENCIES.includes(Number(bondi.agency_id))) {
          visibles[bondi.route_short_name] = true;
        }
      });
  
      if (Object.keys(visibles).length === 0) {
        alert("En este momento no podés rastrear ninguno de los que te interesan");
      }
  
      setVisibleLines((prev) => {
        const updated = {};
        uniqueLines.forEach((linea) => {
          updated[linea] = Boolean(visibles[linea]);
        });
        return updated;
      });
  
    } else {
      lastClickTimeRef.current = now;
  
      setVisibleLines((prev) => {
        const updated = {};
        uniqueLines.forEach((linea) => {
          updated[linea] = false;
        });
        return updated;
      });
    }
  };
  

  const sortedLines = getUniqueLines()
    .filter((linea) => linea.toLowerCase().includes(searchLinea.toLowerCase()))
    .sort((a, b) => {
      const aTildado = visibleLines[a] !== false;
      const bTildado = visibleLines[b] !== false;
      if (aTildado && !bTildado) return -1;
      if (!aTildado && bTildado) return 1;
      return a.localeCompare(b, "es", { sensitivity: "base" });
    });

  return (
    <div className="app-container">
      <header className="app-header">🤷‍♂️ ¿Y dónde está mi Bondiolita? 🤷‍♂️</header>
      <div className="app-body">
        <div className="map-container">
          {error ? (
            <p className="error-msg">{error}</p>
          ) : (
            <MapContainer center={[-34.659973, -58.39788]} zoom={12} style={{ height: "100%" }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              {bondis.map((bondi, index) => {
                const outdated = isOutdated(bondi.timestamp);
                if (visibleLines[bondi.route_short_name] !== false) {
                  return (
                    <Marker
                      key={index}
                      position={[bondi.latitude, bondi.longitude]}
                      icon={createBondiIcon(bondi.route_short_name, bondi.trip_headsign, outdated)}
                    >
                      <Popup>
                        <strong>Línea:</strong> {bondi.route_short_name}<br />
                        <strong>Destino:</strong> {bondi.trip_headsign}<br />
                        <strong>Hora:</strong> {bondi.timestamp}
                      </Popup>
                    </Marker>
                  );
                }
                return null;
              })}
            </MapContainer>
          )}
        </div>

        <div className="sidebar">
          <h3>Líneas disponibles</h3>
          <input
            type="text"
            placeholder="Buscar línea..."
            className="search-input"
            value={searchLinea}
            onChange={(e) => setSearchLinea(e.target.value)}
          />

          <div className="button-group">
            <button onClick={handleSelectAll}>Tildar todas</button>
            <button onClick={handleClearOrAgencyFilter}>Destildar todas</button>
          </div>

          {sortedLines.map((linea) => (
            <div className="line-checkbox" key={linea}>
              <input
                type="checkbox"
                checked={visibleLines[linea] !== false}
                onChange={() => handleCheckboxChange(linea)}
              />
              <span>{linea}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
