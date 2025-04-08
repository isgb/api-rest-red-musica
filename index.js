// Importar dependencias
const express = require('express');
const cors = require('cors');
// Importar conexión a la base de datos
const connection = require('./database/connection');

// Crear servidor de node
const app = express();
const port = 3910;

// Configurar cors
app.use(cors());

// Configurar body parser
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.listen(port, () => {
    console.log('Servidor de node esta escuchando en el puerto: ', port);
});