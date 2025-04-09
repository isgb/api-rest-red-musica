const validate = require("../helpers/validate");
const bcrypt = require('bcrypt')
const User = require("../models/user");

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
    return res.status(200).send({
      status: "error",
      message: "Falta datos por enviar",
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

  // Control usuarios
  User.find({
    $or:[
     {email: params.email.toLowerCase()},
     {nick: params.nick.toLowerCase()}
    ]
  }).exec(async (error, users) => {
    if(error){
        return res.status(500).send({
            status: "error",
            message: "Error en la consulta de control de usuarios duplicados",
        });
    }

    if(users && users.length >= 1){
        return res.status(200).send({
            status: "error",
            message: "El usuario ya existe"
          });
    }

    let pwd = await bcrypt.hash(params.password, 10)
    params.password = pwd;

    let userToSave = new User(params)

    userToSave.save((error, userStored) => {

        if(error || !userStored){
            return res.status(500).send({
                status: "error",
                message: "Error al registrar usuario",
            });
        }

        return res.status(200).send({
            status: "success",
            message: "Usuario registrado correctamente",
            user: userStored
          });
    })

    
  })


};

module.exports = {
  prueba,
  register,
};
