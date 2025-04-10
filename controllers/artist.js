const Artist = require('../models/artist');
const fs = require('fs');
const path = require('path');
const mongoosePagination = require('mongoose-pagination');
const Album = require('../models/album');
const Song = require('../models/song');

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

const list = async (req,res) => {
    // Recoger el id de la url
    let page = req.params.page || 1;
    let itemsPerPage = 5;

    // Buscar artistas
    try {
        const artists = await Artist.find()
                                .sort('name')
                                .paginate(page, itemsPerPage);
        if (!artists) {
            return res.status(404).send({
                status: 'error',
                message: 'No hay artistas'
            });
        }
        return res.status(200).send({
            status: 'success',
            page,
            itemsPerPage,
            total: artists.length,
            artists
        });
    } catch (error) {
        return res.status(500).send({
            status: 'error',
            message: 'Error al buscar los artistas'
        });
    }
}

const update = async (req,res) => {
    // Recoger el id de la url
    let artistId = req.params.id;

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

    // Actualizar el artista en la base de datos
    try {
        const artistUpdated = await Artist.findByIdAndUpdate(artistId, params, {new: true});
        if (!artistUpdated) {
            return res.status(404).send({
                status: 'error',
                message: 'El artista no existe'
            });
        }
        return res.status(200).send({
            status: 'success',
            artist: artistUpdated
        });
    } catch (error) {
        return res.status(500).send({
            status: 'error',
            message: 'Error al actualizar el artista'
        });
    }
}

const remove = async (req,res) => {
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
        // Eliminar el artista de la base de datos
        await Artist.findByIdAndRemove(artistId);
        // Eliminar los albums del artista
        await Album.deleteMany({artist: artistId});
        // Eliminar las canciones del artista
        await Song.deleteMany({artist: artistId});
        return res.status(200).send({
            status: 'success',
            message: 'El artista ha sido eliminado'
        });
    } catch (error) {
        return res.status(500).send({
            status: 'error',
            message: 'Error al eliminar el artista'
        });
    }
}

const upload = async (req,res) =>{

  if(!req.file) {
    return res.status(400).send({
      status: "error",
      message: "No se han subido archivos",
    });
  }

  let image = req.file.originalname;

  const imageSplit = image.split("\.");
  const extension = imageSplit[1];

  // Comprobar la extensión
  const valid_extensions = ["png", "jpg", "jpeg", "gif"];
  if (!valid_extensions.includes(extension)) {
    const filePath = req.file.path;
    const fileDeleted = fs.unlinkSync(filePath);

    return res.status(400).send({
      status: "error",
      message: "La extensión no es válida",
    });
  }

  //Si es correcta, guardar imagen en la base de datos
  try {
    const artistUpdated = await Artist.findByIdAndUpdate(
      {_id:req.user.id},
      { image: req.file.filename },
      { new: true }
    );

    if (!artistUpdated) {
      return res.status(500).send({
        status: "error",
        message: "Error al guardar la imagen del artista",
      });
    }

    return res.status(200).send({
      status: "success",
      artist: artistUpdated,
      file: req.file,
    });
  } catch (err) {
    return res.status(500).send({
      status: "error",
      message: "Error al guardar la imagen de usuario",
      error: err,
    });
  }
}

const image = async (req, res) => {
  // Recoger el parámetro de la url
  const file = req.params.file;

  // Comprobar si existe el fichero
  const filePath = "./uploads/artists/" + file;
  fs.stat(filePath, (err, exists) => {
    if (err || !exists) {
      return res.status(404).send({
        status: "error",
        message: "No existe la imagen",
      });
    }

    // Devolver el archivo
    return res.sendFile(path.resolve(filePath));
  });
}

module.exports = {
    save,
    one,
    list,
    update,
    remove,
    upload,
    image
}