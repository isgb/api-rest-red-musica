// Importar dependencias
const express = require('express')

// Importar el router
const router = express.Router();

// Importar controlador
const AlbumController = require('../controllers/album');

const check = require('../middlewares/auth')

// Configuración de subida
const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/albums/')
    },
    filename: (req, file, cb) => {
        cb(null, 'albums-' + Date.now() + '-' + file.originalname)
    }
})
const uploads = multer({ storage: storage }).single('file0')

// Definir rutas
router.get('/prueba', AlbumController.prueba)
router.post('/save', check.auth, AlbumController.save)
router.get('/one/:id', check.auth, AlbumController.one)
router.get('/list/:artistId', check.auth, AlbumController.list)
router.put('/update/:albumId', check.auth, AlbumController.update)
router.post('/upload', [check.auth, uploads.single('file0')], AlbumController.upload)
router.get('/image/:file', AlbumController.image)

module.exports = {
    router
}