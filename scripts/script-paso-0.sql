create database queveohoy;

use queveohoy;

CREATE TABLE genero (
    id INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE pelicula (
    id INT NOT NULL AUTO_INCREMENT,
    titulo VARCHAR(100) NULL,
    duracion INT NULL,
    director VARCHAR(400) NULL,
    anio INT NULL,
    fecha_lanzamiento DATETIME NULL,
    puntuacion TINYINT NULL,
    poster VARCHAR(300) NULL,
    trama VARCHAR(700) NULL,
    genero_id int null,
    PRIMARY KEY (id),
    FOREIGN KEY(genero_id) REFERENCES genero(id)
);

CREATE TABLE actor (
    id INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(70) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE actor_pelicula (
    id INT NOT NULL AUTO_INCREMENT,
    actor_id int NULL,
    pelicula_id int null,
    PRIMARY KEY (id),
    FOREIGN KEY (actor_id) REFERENCES actor(id),
    FOREIGN KEY (pelicula_id) REFERENCES pelicula(id)
);