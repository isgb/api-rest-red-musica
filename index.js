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

// Cargar configuración de rutas
const UserRoutes = require('./routes/user')
const AlbumRoutes = require('./routes/album')
const SongRoutes = require('./routes/song')
const ArtistRoutes = require('./routes/artist')

app.use("/api/user", UserRoutes)
app.use('/api/album', AlbumRoutes)
app.use('/api/song',SongRoutes)
app.use('/api/artist',ArtistRoutes)

app.listen(port, () => {
    console.log('Servidor de node esta escuchando en el puerto: ', port);
});