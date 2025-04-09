// Importar dependencias
const express = require('express')

// Importar el router
const router = express.Router();

// Importar controlador
const SongController = require('../controllers/song');

// Definir rutas
router.get('/prueba', SongController.prueba)

module.exports = {
    router
}