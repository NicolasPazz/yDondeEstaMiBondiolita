from flask import Flask, jsonify
from flask_cors import CORS
from bondi_location_service import obtener_ubicaciones
import os

app = Flask(__name__)
CORS(app)

@app.route("/api/bondis", methods=["GET"])
def get_bondis():
    ubicaciones = obtener_ubicaciones()

    if not ubicaciones:
        return jsonify({"message": "No se encontraron bondis activos en este momento."}), 404

    return jsonify(ubicaciones)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000)) 
    app.run(host="0.0.0.0", port=port)
