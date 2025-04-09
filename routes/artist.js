// Importar dependencias
const express = require('express')
const check = require('../middlewares/auth')

// Importar el router
const router = express.Router();

// Importar controlador
const ArtistController = require('../controllers/artist');

// Definir rutas
router.get('/prueba', ArtistController.prueba)
router.post('/save', check.auth,ArtistController.save)
router.get('/one/:id', check.auth, ArtistController.one)

module.exports = {
    router
}