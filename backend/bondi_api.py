from flask import Flask, jsonify
from bondi_location_service import obtener_ubicaciones

app = Flask(__name__)

@app.route("/api/bondis", methods=["GET"])
def get_bondis():
    ubicaciones = obtener_ubicaciones()

    if not ubicaciones:
        return jsonify({"message": "No se encontraron bondis activos en este momento."}), 404

    return jsonify(ubicaciones)

if __name__ == "__main__":
    app.run(debug=True)
