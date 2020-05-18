const connection = require('../lib/conexionbd');

function getGeneros(req,res){
    console.log('/generos');
    let sql=' select * from genero ';
    connection.query(sql,function(error,resultado,fields){
        if(error){
            console.log('Error obteniendo generos', error.message);
            return res.status(400).send('Error obteniendo generos');
        }
        res.send({
            generos: resultado
        });
    });
}

module.exports = {
    getGeneros
};