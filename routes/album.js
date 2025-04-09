// Importar dependencias
const express = require('express')

// Importar el router
const router = express.Router();

// Importar controlador
const AlbumController = require('../controllers/album');

// Definir rutas
router.get('/prueba', AlbumController.prueba)

module.exports = {
    router
}