require('dotenv').config();
const db = require('../configs/db.config');
const bcrypt = require('bcrypt');
const saltosBcrypt = parseInt(process.env.BCRYPT);
const connection = await db.createConnection();

const usuarios = [
    { nombre: "nombre1", apellido_P : "apellido_P1", apellido_M : "apellido_P1", email: "email1@gmail.com", password: bcrypt.hashSync('1234', saltosBcrypt) },
    { nombre: "nombre2", apellido_P : "apellido_P2", apellido_M : "apellido_P2", email: "email2@gmail.com", password: bcrypt.hashSync('1234', saltosBcrypt) },
    { nombre: "nombre3", apellido_P : "apellido_P3", apellido_M : "apellido_P3", email: "email3@gmail.com", password: bcrypt.hashSync('1234', saltosBcrypt) },
    { nombre: "nombre4", apellido_P : "apellido_P4", apellido_M : "apellido_P4", email: "email4@gmail.com", password: bcrypt.hashSync('1234', saltosBcrypt) },
    { nombre: "nombre5", apellido_P : "apellido_P5", apellido_M : "apellido_P5", email: "email5@gmail.com", password: bcrypt.hashSync('1234', saltosBcrypt) },
    { nombre: "nombre6", apellido_P : "apellido_P6", apellido_M : "apellido_P6", email: "email6@gmail.com", password: bcrypt.hashSync('1234', saltosBcrypt) },
    { nombre: "nombre7", apellido_P : "apellido_P7", apellido_M : "apellido_P7", email: "email7@gmail.com", password: bcrypt.hashSync('1234', saltosBcrypt) },
    { nombre: "nombre8", apellido_P : "apellido_P8", apellido_M : "apellido_P8", email: "email8@gmail.com", password: bcrypt.hashSync('1234', saltosBcrypt) },
    { nombre: "nombre9", apellido_P : "apellido_P9", apellido_M : "apellido_P9", email: "email9@gmail.com", password: bcrypt.hashSync('1234', saltosBcrypt) },
    { nombre: "nombre10", apellido_P : "apellido_P10", apellido_M : "apellido_P10", email: "email10@gmail.com", password: bcrypt.hashSync('1234', saltosBcrypt)},
];

try {
    connection.query("DELETE FROM usuario", (error, results) => {
        if(error)
            throw error;
        console.log("usuarios eliminados");
    });
    usuarios.map(usuario => {
        connection.query("INSERT INTO usuario(nombre, apellido_paterno, apellido_materno, email, password, deleted, created_at) VALUES (?,?,?,?,?,?,?) ",
            [usuario.nombre, usuario.apellido_P, usuario.apellido_M, usuario.email, usuario.password, false, new Date()],
            (error, results) => {
                if(error)
                    throw error;
                console.log("usuario añadido correctamente");
            });
    });
} catch (err) {
    console.log(err)
}