const Album = require('../models/album'); // Importar el modelo de Album

const save = async (req, res) => {
    // Recoger los datos del body
    let params = req.body;

    // Validar los datos
    try {
        const validate_name = !params.name || !params.description || !params.image;
        if (validate_name) {
            return res.status(400).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }
    } catch (error) {
        return res.status(500).send({
            status: 'error',
            message: 'Error al validar los datos'
        });
    }

    // Crear el objeto a guardar
    const albumToSave = new Album(params);

    // Guardar el album en la base de datos
    try {
        const albumStored = await albumToSave.save();
        return res.status(200).send({
            status: 'success',
            album: albumStored
        });
    } catch (error) {
        return res.status(500).send({
            status: 'error',
            message: 'Error al guardar el album'
        });
    }
}

const one = async (req, res) => {
    // Recoger el id de la url
    let albumId = req.params.id;

    // Comprobar si existe el album
    try {
        const album = await Album.findById(albumId).populate('artist', 'name');
        if (!album) {
            return res.status(404).send({
                status: 'error',
                message: 'El album no existe'
            });
        }
        return res.status(200).send({
            status: 'success',
            album
        });
    } catch (error) {
        return res.status(500).send({
            status: 'error',
            message: 'Error al buscar el album'
        });
    }
}

const list = async(req, res) => {
    // Recoger el id de la url
    let artistId = req.params.artistId;

    // Comprobar si existe el album
    try {
        const albums = await Album.find({ artist: artistId })
                                  .populate('artist', 'name')
                                  .sort('-year').exec();
        if (!albums) {
            return res.status(404).send({
                status: 'error',
                message: 'No hay albums'
            });
        }
        return res.status(200).send({
            status: 'success',
            albums
        });
    } catch (error) {
        return res.status(500).send({
            status: 'error',
            message: 'Error al buscar los albums'
        });
    }
}

const update = async (req, res) => {
    // Recoger el id de la url
    let albumId = req.params.id;

    // Recoger los datos del body
    let params = req.body;

    // Validar los datos
    try {
        const validate_name = !params.name || !params.description || !params.image;
        if (validate_name) {
            return res.status(400).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }
    } catch (error) {
        return res.status(500).send({
            status: 'error',
            message: 'Error al validar los datos'
        });
    }

    // Actualizar el album en la base de datos
    try {
        const albumUpdated = await Album.findByIdAndUpdate(albumId, params, { new: true });
        if (!albumUpdated) {
            return res.status(404).send({
                status: 'error',
                message: 'No se ha podido actualizar el album'
            });
        }
        return res.status(200).send({
            status: 'success',
            album: albumUpdated
        });
    } catch (error) {
        return res.status(500).send({
            status: 'error',
            message: 'Error al actualizar el album'
        });
    }
}

module.exports = {
    save,
    one,
    list,
    update
}