const validate = require("../helpers/validate");
const bcrypt = require('bcrypt')
const User = require("../models/user");
const jwt = require("../helpers/jwt");
const fs = require("fs");
const path = require("path");


const prueba = async (req, res) => {
  return res.status(200).send({
    status: "success",
    message: "Mensaje enviado desde: controllers/user.js",
  });
};

// Registro
const register = async (req, res) => {
  let params = req.body;

  if (!params.name || !params.nick || !params.email || !params.password) {
    return res.status(400).send({
      status: "error",
      message: "Faltan datos por enviar",
    });
  }

  // Validar los datos
  try {
    validate(params);
  } catch (error) {
    return res.status(400).send({
      status: "error",
      message: "Validación no superada",
    });
  }

  try {
    // Control usuarios duplicados
    const existingUser = await User.findOne({
      $or: [
        { email: params.email.toLowerCase() },
        { nick: params.nick.toLowerCase() },
      ],
    });

    if (existingUser) {
      return res.status(400).send({
        status: "error",
        message: "El usuario ya existe",
      });
    }

    // Encriptar contraseña
    params.password = await bcrypt.hash(params.password, 10);

    // Crear y guardar usuario
    const userToSave = new User(params);
    const userStored = await userToSave.save();

    // Limpiar el objeto a devolver
    let userCreated = userStored.toObject();
    delete userCreated.password;
    delete userCreated.role;

    return res.status(200).send({
      status: "success",
      message: "Usuario registrado correctamente",
      user: userCreated,
    });

  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error al registrar usuario",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  let params = req.body;

  if (!params.email || !params.password) {
    return res.status(400).send({
      status: "error",
      message: "Faltan datos por enviar",
    });
  }

  try {
    // Buscar el usuario
    const user = await User.findOne({ email: params.email.toLowerCase() })
      .select("+password +role") // Incluir el campo de contraseña en la consulta

    if (!user) {
      return res.status(404).send({
        status: "error",
        message: "Usuario no encontrado",
      });
    }

    // Comprobar la contraseña
    const checkPassword = await bcrypt.compare(params.password, user.password);

    if (!checkPassword) {
      return res.status(401).send({
        status: "error",
        message: "Login incorrecto",
      });
    }

    // Limpiar el objeto a devolver
    let userToReturn = user.toObject();
    delete userToReturn.password;
    delete userToReturn.role;

    // Conseguir token jwt
    const token = jwt.createToken(user);

    return res.status(200).send({
      status: "success",
      message: "Usuario logueado correctamente",
      user: userToReturn,
      token
    });

  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error al iniciar sesión",
      error: error.message,
    });
  }
}

const profile = async (req, res) => {
  // Obtener el id del usuario logueado
  const userId = req.user.id;

  // Buscar el usuario
  try {
    const user = await User.findById(userId).select("-password -role");

    if (!user) {
      return res.status(404).send({
        status: "error",
        message: "Usuario no encontrado",
      });
    }

    return res.status(200).send({
      status: "success",
      user,
    });

  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error al obtener el perfil",
      error: error.message,
    });
  }
}

const update = async (req, res) => {
  // Obtener el id del usuario logueado
  const userId = req.user;
  const userToUpdate = req.body;

  // Validar los datos
  try {
    validate(userToUpdate);
  } catch (error) {
    return res.status(400).send({
      status: "error",
      message: "Validación no superada",
    });
  }

  try {
    // Comprobar si el email o nick ya existen en otro usuario
    const existingUser = await User.find({
      $or: [
        { email: userToUpdate.email?.toLowerCase() },
        { nick: userToUpdate.nick?.toLowerCase() },
      ],
      _id: { $ne: userId }, // Excluir al usuario actual
    });

    if (existingUser.length > 0) {
      return res.status(400).send({
        status: "error",
        message: "El email o nick ya están en uso por otro usuario",
      });
    }

    // Encriptar contraseña si se ha enviado
    if (userToUpdate.password) {
      userToUpdate.password = await bcrypt.hash(userToUpdate.password, 10);
    } else {
      delete userToUpdate.password; // Eliminar la contraseña si no se ha enviado
    }

    // Actualizar el usuario
    const userUpdated = await User.findByIdAndUpdate(userId, userToUpdate, { new: true }).select("-password -role");

    if (!userUpdated) {
      return res.status(404).send({
        status: "error",
        message: "Usuario no encontrado",
      });
    }

    return res.status(200).send({
      status: "success",
      message: "Usuario actualizado correctamente",
      user: userUpdated,
    });

  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error al actualizar el usuario",
      error: error.message,
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
    const userUpdated = await User.findByIdAndUpdate(
      {_id:req.user.id},
      { image: req.file.filename },
      { new: true }
    );

    if (!userUpdated) {
      return res.status(500).send({
        status: "error",
        message: "Error al guardar la imagen de usuario",
      });
    }

    return res.status(200).send({
      status: "success",
      user: userUpdated,
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

const avatar = async (req, res) => {
  // Recoger el parámetro de la url
  const file = req.params.file;

  // Comprobar si existe el fichero
  const filePath = "./uploads/avatars/" + file;
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
  prueba,
  register,
  login,
  profile,
  update,
  upload,
  avatar
};
