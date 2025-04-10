// Importar dependencias
const express = require('express')

// Importar el router
const router = express.Router();

// Importar controlador
const AlbumController = require('../controllers/album');

const check = require('../middlewares/auth')

// Definir rutas
router.get('/prueba', AlbumController.prueba)
router.post('/save', check.auth, AlbumController.save)
router.get('/one/:id', check.auth, AlbumController.one)
router.get('/list/:artistId', check.auth, AlbumController.list)
router.put('/update/:albumId', check.auth, AlbumController.update)

module.exports = {
    router
}