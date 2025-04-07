import requests
import datetime
import os
import json
from dotenv import load_dotenv

load_dotenv()

CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")

ROUTES = [283, 284, 287, 288, 496, 497, 922, 923, 924, 925, 926, 927, 1161, 1162, 1199, 1200, 1201]
AGENCIES = [87, 83, 51]

def obtener_ubicaciones():
    ubicaciones = []

    url = (
        f"https://apitransporte.buenosaires.gob.ar/colectivos/vehiclePositionsSimple"
        f"?client_id={CLIENT_ID}&client_secret={CLIENT_SECRET}"
    )

    try:
        res = requests.get(url)

        if res.status_code == 200:
            data = res.json()

            if isinstance(data, list) and len(data) > 0:
                for item in data:
                    # if (item.get("route_id") in ROUTES) or (item.get("agency_id") in AGENCIES):
                        ubicaciones.append({
                            "route_short_name": item["route_short_name"],
                            "agency_id": item["agency_id"],
                            "latitude": item["latitude"],
                            "longitude": item["longitude"],
                            "timestamp": datetime.datetime.fromtimestamp(item["timestamp"]).strftime("%H:%M:%S"),
                            "trip_headsign": item["trip_headsign"]
                        })
            else:
                print("[Aviso] No se encontraron vehículos.")
        else:
            print(f"[Error] La API respondió con un error. Código: {res.status_code}")
    except Exception as e:
        print(f"[Error] Error al hacer la solicitud a la API: {e}")

    return ubicaciones
