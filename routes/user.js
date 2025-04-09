// Importar dependencias
const express = require('express')

// Importar el router
const router = express.Router();

// Importar controlador
const UserController = require('../controllers/user');

// Definir rutas
router.get('/prueba', UserController.prueba)
router.post('/register', UserController.register)

module.exports = {
    router
}