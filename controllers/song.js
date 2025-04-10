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

const image = async (req, res) => {
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

module.exports = {
    save,
    upload,
    image,
    one
}