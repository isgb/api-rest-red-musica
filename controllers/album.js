const Album = require('../models/album'); // Importar el modelo de Album
const fs = require('fs'); // Importar el módulo fs para manejar archivos
const path = require('path'); // Importar el módulo path para manejar rutas de archivos
const mongoosePagination = require('mongoose-pagination'); // Importar el módulo de paginación de mongoose

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
    const albumUpdated = await Album.findByIdAndUpdate(
      {_id:req.user.id},
      { image: req.file.filename },
      { new: true }
    );

    if (!albumUpdated) {
      return res.status(500).send({
        status: "error",
        message: "Error al guardar la imagen decla canción",
      });
    }

    return res.status(200).send({
      status: "success",
      album: albumUpdated,
      file: req.file,
    });
  } catch (err) {
    return res.status(500).send({
      status: "error",
      message: "Error al guardar la imagen de la canción",
      error: err,
    });
  }
}

const image = async (req, res) => {
  // Recoger el parámetro de la url
  const file = req.params.file;

  // Comprobar si existe el fichero
  const filePath = "./uploads/albums/" + file;
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
    upload,
    image   
}