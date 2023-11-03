const dotenv = require("dotenv");
dotenv.config();

const mysql = require('mysql2');
let connection;

try {
    connection = mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
    });
} catch (error) {
    console.log("Error al conectar con la base de datos");
}

module.exports = {connection};