// Importar dependencias
const express = require('express')

// Importar el router
const router = express.Router();

// Importar controlador
const SongController = require('../controllers/song');

// Importar middleware de autenticación
const check = require('../middlewares/auth'); // Middleware de autenticación

// Configuración de subida
const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/songs/')
    },
    filename: (req, file, cb) => {
        cb(null, 'songs-' + Date.now() + '-' + file.originalname)
    }
})
const uploads = multer({ storage: storage }).single('file0')

// Definir rutas
router.get('/prueba', SongController.prueba)
router.post('/save', check.auth, SongController.save)
router.post('/upload', [check.auth, uploads.single('file0')], SongController.upload)
router.get('/audio/:file', SongController.audio)
router.get('/one/:id', check.auth, SongController.one)
router.get('/list/:albumId', check.auth, SongController.list)
router.put('/update/:id', check.auth, SongController.update)
router.delete('/remove/:id', check.auth, SongController.remove)

module.exports = {
    router
}