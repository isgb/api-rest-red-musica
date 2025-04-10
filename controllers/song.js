const Song = require('../models/song');
const fs = require('fs');
const path = require('path');
const mongoosePagination = require('mongoose-pagination');

const save = async (req, res) => {
    const song = new Song(req.body);
    try {
        const songStored = await song.save();
        return res.status(200).send({ song: songStored });
    } catch (error) {
        return res.status(500).send({ message: 'Error al guardar la canción' });
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
  const valid_extensions = ["mp3", "ogg"];
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
    const songUpdated = await Song.findByIdAndUpdate(
      {_id:req.user.id},
      { image: req.file.filename },
      { new: true }
    );

    if (!songUpdated) {
      return res.status(500).send({
        status: "error",
        message: "Error al guardar la imagen decla canción",
      });
    }

    return res.status(200).send({
      status: "success",
      song: songUpdated,
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

const audio = async (req, res) => {
  // Recoger el parámetro de la url
  const file = req.params.file;

  // Comprobar si existe el fichero
  const filePath = "./uploads/songs/" + file;
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

const one = async (req, res) => {
    const songId = req.params.id;
    try {
        const song = await Song.findById(songId);
        if (!song) {
            return res.status(404).send({ message: 'Canción no encontrada' });
        }
        return res.status(200).send({ song });
    } catch (error) {
        return res.status(500).send({ message: 'Error al obtener la canción' });
    }
}

const list = async (req, res) => {
    // Recoger el id del artista
    const albumId = req.params.albumId;

    // Comprobar si existe el álbum
    if (!albumId || albumId == null) {
      return res.status(404).send({
        status: "error",
        message: "El álbum no existe",
      });
    }

    // Buscar las canciones
    try {
      const songs = await Song.find({ album: albumId })
              .sort('track')
              .populate({ path: 'album', populate: { path: 'artist'} })
              .exec();
      return res.status(200).send({ songs });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Error al obtener las canciones",
      });
    }
}

const update = async (req,res) => {
    // Recoger el id de la canción
    const songId = req.params.id;
    const update = req.body;

    // Comprobar si existe el id
    if (!songId || songId == null) {
      return res.status(404).send({
        status: "error",
        message: "El id no existe",
      });
    }

    // Actualizar la canción
    try {
      const songUpdated = await Song.findByIdAndUpdate(songId, update, {
        new: true,
      });
      return res.status(200).send({
        status: "success",
        song: songUpdated,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Error al actualizar la canción",
      });
    }
}

const remove = async (req, res) => {
    // Recoger el id de la canción
    const songId = req.params.id;

    // Comprobar si existe el id
    if (!songId || songId == null) {
      return res.status(404).send({
        status: "error",
        message: "El id no existe",
      });
    }

    // Eliminar la canción
    try {
      const songRemoved = await Song.findByIdAndRemove(songId);
      return res.status(200).send({
        status: "success",
        song: songRemoved,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Error al eliminar la canción",
      });
    }
}

module.exports = {
    save,
    upload,
    audio,
    one,
    list,
    update,
    remove
}