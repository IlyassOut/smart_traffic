/*const express = require("express");
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
            console.error("Erreur :", stderr);console.log("Erreur de traitement YOLO");
            return res.status(500).json({ error: "Erreur de traitement YOLO" });
        }

        // Renvoyer le résultat au client
        try {
            const result = JSON.parse(stdout);
            res.json(result);
        } catch (err) {console.log("Erreur de traitement des résultats");
            res.status(500).json({ error: "Erreur de traitement des résultats" });
        }
    });
});

// Démarrer le serveur
const PORT = 3300;
app.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
});*/
/*
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Permet les requêtes cross-origin (React -> Node.js)
app.use(express.json()); // Pour analyser les données JSON

// Fake users pour les tests
const fakeUsers = [
  { email: 'test@example.com', password: '123456' },
  { email: 'user@example.com', password: 'password' },
];

// Route POST /login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Vérification des credentials
  const user = fakeUsers.find((u) => u.email === email && u.password === password);

  if (user) {
    return res.status(200).json({ success: true, message: 'Connexion réussie !' });
  } else {
    return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect.' });
  }
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
*/
const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const { exec } = require("child_process");

const app = express();
const port = 3300;

// Middleware pour parser le JSON
app.use(bodyParser.json());

// Configuration de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Route POST pour traiter l'image
app.post('/upload-image', upload.single('image'), (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    // Appeler le script Python avec le chemin de l'image
    const pythonScript = path.join(__dirname, "test.py");
    const command = `python3 ${pythonScript} ${file.path}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error("Erreur :", stderr);console.log("Erreur de traitement YOLO");
            return res.status(500).json({ error: "Erreur de traitement YOLO" });
        }

        // Renvoyer le résultat au client
        try {
            const result = JSON.parse(stdout);
            res.json(result);
        } catch (err) {console.log("Erreur de traitement des résultats");
            res.status(500).json({ error: "Erreur de traitement des résultats" });
        }
    });
});

// Lancer le serveur
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
