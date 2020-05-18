const connection = require('../lib/conexionbd');

function getPelicula(req, res) {
    console.log(`/peliculas`);
    
    let paramsSQL = sqlBuilder(req);

    const sql = `SELECT * FROM pelicula${paramsSQL.sqlWhere}${paramsSQL.sqlOrder}${paramsSQL.sqlLimit}`;
    const sqlTotal = `SELECT COUNT(*) AS total FROM pelicula${paramsSQL.sqlWhere}`;

    console.log(sql);

    connection.query(sql, function (error, resultado, fields) {
        if (error) {
            console.log('Error en la consulta de peliculas', error.message);
            return res.status(400).send('Error en la consulta de peliculas');
        }
        connection.query(sqlTotal, function (error, resultadoTotal, fields) {
            if (error) {
                console.log('Error en la consulta del total de peliculas', error.message);
                return res.status(400).send('Error en la consulta del total de peliculas');
            }
            res.send({
                'peliculas': resultado,
                'total': resultadoTotal[0].total,
                'numeropagina': req.query.pagina
            });
        });
    });
}

function getRecomendacion(req, res) {
    console.log(`/peliculas/recomendacion`);
    
    let paramsSQL = sqlBuilder(req);

    const sql = `SELECT p.* FROM pelicula p JOIN genero g ON p.genero_id = g.id${paramsSQL.sqlWhere}${paramsSQL.sqlOrder}${paramsSQL.sqlLimit}`;


    console.log(sql);

    connection.query(sql, function (error, resultado, fields) {
        if (error) {
            console.log('Error en la consulta de peliculas recomendadas', error.message);
            return res.status(400).send('Error en la consulta de peliculas recomendadas');
        }
        res.send({
            'peliculas': resultado
        });
    });
}

function getPeliculaPorId(req, res){
    // TODO se puede mejorar separando la query que busca la pelicula+genero de la que busca los actores
    console.log(`/peliculas/${req.params.id}`);
    const sql='SELECT p.id,' +
                'p.titulo,' +
                'p.duracion,' +
                'p.director,' +
                'p.anio,' +
                'p.fecha_lanzamiento,' +
                'p.puntuacion,' +
                'p.poster,' +
                'p.trama,' +
                'g.nombre AS nombreGenero,' +
                'a.nombre AS nombreActor' +
        '\nFROM pelicula p ' +
            'JOIN actor_pelicula ap ON p.id = ap.pelicula_id ' +
            'JOIN actor a on ap.actor_id=a.id ' +
            'JOIN genero g on p.genero_id=g.id ' +
        '\nwhere p.id= ' + req.params.id;

    connection.query(sql,function(error,resultado,fields){
        if(error){
            let message = `Error en la consulta de pelicula por ID: ${req.params.id}`
            console.log(message + `\nError: ${error.message}`);
            return res.status(400).send(message);
        }
        if(resultado.length==0){
            let message = `No se encontro pelicula con el ID: ${req.params.id}`
            console.log(message, + `\nError: ${error.message}`);
            return res.status(404).send(message);
        } 
        let actores = [];
        resultado.forEach(row => actores.push(
            {nombre: row.nombreActor}
        ));

        resultado = resultado[0];
        let pelicula = {
            id: resultado.id,
            titulo: resultado.titulo,
            director: resultado.director,
            anio: resultado.anio,
            fecha_lanzamiento: resultado.fecha_lanzamiento,
            puntuacion: resultado.puntuacion,
            poster: resultado.poster,
            trama: resultado.trama,
            nombre: resultado.nombreGenero,
            duracion: resultado.duracion
        }

        res.send({
            'pelicula': pelicula,
            'actores':  actores
        });
    });
}

function sqlBuilder(req){
    let sqlWhere = '';
    let sqlOrder = '';
    let sqlLimit = ''
    let keys = Object.keys(req.query);

    keys.forEach(key => {
        switch (key) {
            case "titulo":
                sqlWhere += sqlWhere.length === 0 ? ' WHERE ' : ' AND ';
                sqlWhere += `UPPER(titulo) LIKE UPPER('%${req.query.titulo}%')`;
                break;
            case "genero":
                sqlWhere += sqlWhere.length === 0 ? ' WHERE ' : ' AND ';
                if (isNaN(req.query.genero)){
                    sqlWhere += `nombre = '${req.query.genero}'`;
                } else {
                    sqlWhere += `genero_id = ${req.query.genero}`;
                }
                break;
            case "anio":
                sqlWhere += sqlWhere.length === 0 ? ' WHERE ' : ' AND ';
                sqlWhere += `anio = ${req.query.anio}`;
                break;
            case "puntuacion":
                sqlWhere += sqlWhere.length === 0 ? ' WHERE ' : ' AND ';
                sqlWhere += `puntuacion = ${req.query.puntuacion}`;
                break;
            case "anio_inicio":
                sqlWhere += sqlWhere.length === 0 ? ' WHERE ' : ' AND ';
                sqlWhere += `YEAR(fecha_lanzamiento) BETWEEN ${req.query.anio_inicio} AND ${req.query.anio_fin || 2020} `;
                break;
            case "columna_orden":
                let asd_dsc = ` ${req.query.tipo_orden}` || '';
                let columna = req.query.columna_orden === 'genero' ? 'genero_id' : req.query.columna_orden;
                sqlOrder += ` ORDER BY ${columna}${asd_dsc}`;
                break;
            case "pagina":
                let pagina = req.query.pagina || 0;
                sqlLimit += ` LIMIT ${req.query.cantidad || 52} OFFSET ${(req.query.cantidad || 52) * (pagina - 1)}`
            default:
                break;
        }
    });

    return {
        sqlWhere,
        sqlOrder,
        sqlLimit
    }
}

module.exports = {
    getPelicula,
    getPeliculaPorId,
    getRecomendacion
}