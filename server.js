const express = require("express");
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const path = require("path");

const app = express();
app.use(bodyParser.json());

// Point de terminaison pour recevoir une image
app.post("/process-image", (req, res) => {
    const imagePath = req.body.imagePath; // Chemin de l'image envoyé par le client

    if (!imagePath) {
        return res.status(400).json({ error: "Chemin de l'image requis." });
    }

    // Appeler le script Python avec le chemin de l'image
    const pythonScript = path.join(__dirname, "test.py");
    const command = `python3 ${pythonScript} ${imagePath}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error("Erreur :", stderr);
            return res.status(500).json({ error: "Erreur de traitement YOLO" });
        }

        // Renvoyer le résultat au client
        try {
            const result = JSON.parse(stdout);
            res.json(result);
        } catch (err) {
            res.status(500).json({ error: "Erreur de traitement des résultats de kaka" });
        }
    });
});

// Démarrer le serveur
const PORT = 3300;
app.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
});

