from ultralytics import YOLO
import sys
import json

def analyze_image(image_path):
    model = YOLO("yolov8n.pt")  # Charger YOLO
    results = model(image_path, verbose=False)

    # Filtrer les classes de véhicules (par exemple : voiture, bus, camion, moto)
    vehicle_classes = [2, 3, 5, 7]  # Classes pour les véhicules selon le modèle YOLO
    vehicles = [r for r in results[0].boxes if int(r.cls) in vehicle_classes]

    # Déterminer l'état du trafic
    if len(vehicles) == 10:
        traffic_status = "medium"
    else:
        traffic_status = "high" if len(vehicles) > 10 else "low"

    return traffic_status

if __name__ == "__main__":
    image_path = sys.argv[1]

    try:
        # Analyse de l'image
        result = analyze_image(image_path)

        # Retourner uniquement le JSON attendu
        output = {"traffic_status": result}
        print(json.dumps(output))  # Afficher uniquement le JSON final
    except Exception as e:
        print(f"Erreur : {e}", file=sys.stderr)
