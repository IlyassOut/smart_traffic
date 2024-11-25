from ultralytics import YOLO
import sys
import json

def analyze_image(image_path):
    model = YOLO("yolov8n.pt")  # Charger YOLO
    results = model(image_path, verbose=False)

    # Classes pour les véhicules selon le modèle YOLO (par exemple : voiture, bus, camion, moto)
    vehicle_classes = [2, 3, 5, 7]  
    vehicles = [r for r in results[0].boxes if int(r.cls) in vehicle_classes]

    # Classe pour les piétons (par exemple : personne)
    pedestrian_class = 0
    pedestrians = [r for r in results[0].boxes if int(r.cls) == pedestrian_class]

    # Déterminer l'état du trafic
    if len(vehicles) == 10:
        traffic_status = "moyen"
    else:
        traffic_status = "eleve" if len(vehicles) > 10 else "faible"

    # Retourner les résultats
    return {
        "traffic_status": traffic_status,
        "pedestrians_count": len(pedestrians)  # Nombre de piétons détectés
    }

if __name__ == "__main__":
    image_path = sys.argv[1]

    try:
        # Analyse de l'image
        result = analyze_image(image_path)

        # Retourner uniquement le JSON attendu
        print(json.dumps(result))  # Afficher uniquement le JSON final
    except Exception as e:
        print(f"Erreur : {e}", file=sys.stderr)
