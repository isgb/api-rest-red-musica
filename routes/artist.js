// Importar dependencias
const express = require('express')
const check = require('../middlewares/auth')

// Importar el router
const router = express.Router();

// Importar controlador
const ArtistController = require('../controllers/artist');

// Configuración de subida
const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/artists/')
    },
    filename: (req, file, cb) => {
        cb(null, 'artists-' + Date.now() + '-' + file.originalname)
    }
})
const uploads = multer({ storage: storage }).single('file0')

// Definir rutas
router.get('/prueba', ArtistController.prueba)
router.post('/save', check.auth,ArtistController.save)
router.get('/one/:id', check.auth, ArtistController.one)
router.get('/list/:page', check.auth, ArtistController.list)
router.put('/update/:id', check.auth, ArtistController.update)  
router.delete('/remove/:id', check.auth, ArtistController.remove)
router.post('/upload', [check.auth, uploads.single('file0')], ArtistController.upload)
router.get('/image/:file', ArtistController.image)


module.exports = {
    router
}