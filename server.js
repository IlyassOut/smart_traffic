const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000; // Port de votre API

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/testdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log('Failed to connect to MongoDB', err));

// Définir un schéma et un modèle Mongoose
const trafficDataSchema = new mongoose.Schema({
    vehicle_count: Number,
    average_speed: String,
    traffic_density: String,
    timestamp: { type: Date, default: Date.now }
});

const TrafficData = mongoose.model('TrafficData', trafficDataSchema);

// Route pour recevoir les données
app.post('/api/data', async (req, res) => {
    const newTrafficData = new TrafficData(req.body);
    try {
        await newTrafficData.save();
        res.status(201).send('Data saved successfully');
    } catch (err) {
        res.status(400).send('Error saving data: ' + err.message);
    }
});
app.get('/api/average-speed', async (req, res) => {
    try {
        const averageSpeed = await TrafficData.aggregate([
            { $group: { _id: null, avgSpeed: { $avg: { $toDouble: "$average_speed" } } } }
        ]);
        res.status(200).json({ averageSpeed: averageSpeed[0] ? averageSpeed[0].avgSpeed : 0 });
    } catch (err) {
        res.status(500).send('Error calculating average speed: ' + err.message);
    }
});

app.get('/api/total-vehicles', async (req, res) => {
    try {
        const totalVehicles = await TrafficData.countDocuments();
        res.status(200).json({ totalVehicles });
    } catch (err) {
        res.status(500).send('Error counting vehicles: ' + err.message);
    }
});

app.get('/api/traffic-density', async (req, res) => {
    try {
        const densityCounts = await TrafficData.aggregate([
            { $group: { _id: "$traffic_density", count: { $sum: 1 } } }
        ]);
        res.status(200).json(densityCounts);
    } catch (err) {
        res.status(500).send('Error analyzing traffic density: ' + err.message);
    }
});



// Lancer le serveur
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

