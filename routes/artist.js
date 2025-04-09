// Importar dependencias
const express = require('express')

// Importar el router
const router = express.Router();

// Importar controlador
const ArtistController = require('../controllers/artist');

// Definir rutas
router.get('/prueba', ArtistController.prueba)

module.exports = {
    router
}