// Importar dependencias
const express = require('express')
const check = require('../middlewares/auth')

// Importar el router
const router = express.Router();

// Importar controlador
const UserController = require('../controllers/user');

// Configuración de subida
const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/avatars/')
    },
    filename: (req, file, cb) => {
        cb(null, 'avatar-' + Date.now() + '-' + file.originalname)
    }
})
const uploads = multer({ storage: storage }).single('file0')

// Definir rutas
router.get('/prueba', check.auth, UserController.prueba)
router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/profile/:id',check.auth, UserController.profile)
router.put('/update', check.auth, UserController.update)
router.post('/upload', [check.auth, uploads.single('file0')], UserController.upload)
router.get('/avatar/:file', UserController.avatar)

module.exports = {
    router
}