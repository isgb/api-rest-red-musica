const Artist = require('../models/artist');
const fs = require('fs');

// Accion para guardar un artista
const save = async (req, res) => {
    // Recoger los datos del body
    let params = req.body;

    // Validar los datos
    try {
        if (!params.name) {
            throw new Error('El nombre es obligatorio');
        }
    } catch (error) {
        return res.status(400).send({
            status: 'error',
            message: error.message
        });
    }

    // Crear el objeto a guardar
    const artistToSave = new Artist(params);

    // Guardar el artista en la base de datos
    try {
        const artistStored = await artistToSave.save();
        return res.status(200).send({
            status: 'success',
            artist: artistStored
        });
    } catch (error) {
        return res.status(500).send({
            status: 'error',
            message: 'Error al guardar el artista'
        });
    }
}

const one = async (req,res) => {
    // Recoger el id de la url
    let artistId = req.params.id;

    // Comprobar si existe el artista
    try {
        const artist = await Artist.findById(artistId);
        if (!artist) {
            return res.status(404).send({
                status: 'error',
                message: 'El artista no existe'
            });
        }
        return res.status(200).send({
            status: 'success',
            artist
        });
    } catch (error) {
        return res.status(500).send({
            status: 'error',
            message: 'Error al buscar el artista'
        });
    }
}

module.exports = {
    save,
    one
}