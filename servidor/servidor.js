//paquetes necesarios para el proyecto
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const controladorPeliculas = require('./controladores/peliculas');
const controladorGeneros = require('./controladores/generos');

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get('/peliculas/recomendacion', controladorPeliculas.getRecomendacion);
app.get('/peliculas', controladorPeliculas.getPelicula);
app.get('/peliculas/:id', controladorPeliculas.getPeliculaPorId);
app.get('/generos', controladorGeneros.getGeneros);

//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = '8080';

app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});

