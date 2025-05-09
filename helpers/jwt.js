// Importar dependencias
const jwt = require('jwt-simple')
const moment = require('moment')

// Clave secreta
const secret = "CALVE_SECRETA_DEL_PROYECTO_DE_LA_API_MUSICAL_74987928";

// Crear una funcion para generar tokens
const createToken = (user) => {
    const payload = {
        id: user._id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        imagen: user.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    }

    // Devolver jwt token codificado
    return jwt.encode(payload, secret)
}

// Devolver jwt token codificado
module.exports = {
    secret,
    createToken
}