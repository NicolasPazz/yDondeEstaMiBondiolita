from flask import Flask, jsonify
from flask_cors import CORS
from bondi_location_service import obtener_ubicaciones
import os

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "<h1>🚍 API de Bondiolita funcionando correctamente</h1>", 200

@app.route("/api/bondis", methods=["GET"])
def get_bondis():
    try:
        ubicaciones = obtener_ubicaciones()

        if not ubicaciones:
            return jsonify({"message": "No se encontraron bondis activos en este momento."}), 404

        return jsonify(ubicaciones), 200

    except Exception as e:
        print(f"[Error] Error al obtener ubicaciones: {e}")
        return jsonify({"message": "Hubo un problema al obtener las ubicaciones de los bondis."}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
