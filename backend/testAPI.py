from bondi_location_service import obtener_ubicaciones

ubicaciones = obtener_ubicaciones()
print("Ubicaciones encontradas:")
for ubicacion in ubicaciones:
    print(ubicacion)
