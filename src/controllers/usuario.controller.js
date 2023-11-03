const dotenv = require("dotenv");
dotenv.config();
const bcrypt = require('bcrypt');

const {connection} = require("../configs/db");
const fs = require("fs");
const path = require("path");
const {getImageType} = require("../helpers/image.helper");

const indexUsuarios = async (request, response) => {
    const { page, limit } = request.query;
    const skip = (page - 1) * limit;
    let query;
    if (page && limit) {
        query ="SELECT * FROM usuario WHERE deleted = false LIMIT ?, ?"
    }
    else {
        query ="SELECT * FROM usuario WHERE deleted = false"
    }
    connection.query(query,
        [skip, limit],
        (error, results) => {
            if(error)
                throw error;
            results?.map(img => {
                console.log(img)
                fs.writeFileSync(path.join(__dirname, '../dbimagesUser/' + img.fotografia + getImageType(img.fotografia)), img.fotografia)
            })
            const imagedir = fs.readdirSync(path.join(__dirname, '../dbimagesUser/'));
            results?.map((img, index) => {
                img.fotografia = imagedir[index];
            });
            let res = {
                message: "se obtuvieron correctamente los usuarios",
                data: results
            }
            if (page && limit) {
                const totalUsuarios = results.length;
                const totalPages = Math.ceil(totalUsuarios / limit);

                res = {
                    ...res,
                    total: totalUsuarios,
                    totalPages,
                }
            }

            return response.status(200).json(res);
        });
};
const getByUsuario = async (request, response) => {
    const id = request.params.id;
    connection.query("SELECT * FROM usuario WHERE email = ?",
        [id],
        (error, results) => {
            if(error)
                return response.status(500).json({
                    message: "ocurrió un error al obtener el usuario",
                    error: error.message
                });
            response.status(200).json({
                message: "se obtuvo el usuario correctamente",
                results,
            });
        });
}
const postUsuario = async (request, response) => {
    const {email, password, nombre, apellido_P, apellido_M} = request.body;
    connection.query("INSERT INTO usuario( email, contrasena, nombre, apellido_paterno, apellido_materno, deleted, created_at) VALUES (?,?,?,?,?,?) ",
        [ email, bcrypt.hashSync(password, parseInt(process.env.BCRYPT)), nombre, apellido_P, apellido_M, false, new Date()],
        (error, results) => {
            if(error)
                throw error;
            response.status(201).json({"Item añadido correctamente": results.affectedRows});
        });
};

const patchUsuario = async (request, response) => {
    const id = request.params.id;
    const updatedFields = request.body;
    const campos = [];
    const valores = [];

    if (request.file) {
        campos.push('fotografia = ?');
        valores.push(fs.readFileSync(path.join(__dirname, '../images/' + request.file.filename)));
    }

    for (const key in updatedFields) {
        campos.push(`${key} = ?`);
        valores.push(updatedFields[key]);
    }

    if (campos.length === 0) {
        return response.status(400).json({ error: 'No se proporcionaron campos para actualizar.' });
    }
    connection.query(`UPDATE usuario SET ${campos.join(',')}, updated_at = ? WHERE id_usuarios = ?`,
        [...valores, new Date(), id],
        (error, results) => {
            if(error)
                return response.status(500).json({
                    mensaje: "no se pudo actualizar el usuario",
                    error: error.message
                });
            response.status(201).json({"Item actualizado":results.affectedRows});
        });
}

const putUsuarios = async (request, response) => {
    const id = request.params.id;
    const {email, password, nombre, apellido_P, apellido_M} = request.body;
    const data = fs.readFileSync(path.join(__dirname, '../images/' + request.file.filename))
    connection.query("UPDATE usuario SET email = ?, contrasena = ?, nombre = ?, apellido_paterno = ?, apellido_materno = ?, fotografia = ?, updated_at = ? WHERE id_usuarios = ?",
        [email, password, nombre, apellido_P, apellido_M, data, new Date(), id],
        (error, results) => {
            if(error)
                return response.status(500).json({
                    mensaje: "no se pudo actualizar el usuario",
                    error: error.message
                });
            response.status(201).json({"Item actualizado":results.affectedRows});
        });
}
const delUsuario = async (request, response) => {
    const id = request.params.id;
    connection.query("UPDATE usuario SET deleted = ?, deleted_at = ? where id_usuarios = ?",
        [true, new Date(),id],
        (error, results) => {
            if(error)
                throw error;
            response.status(201).json({"Item eliminado":results.affectedRows});
        });
};



module.exports = {
    index: indexUsuarios,
    getById: getByUsuario,
    create: postUsuario,
    updatePartial: patchUsuario,
    updateComplete: putUsuarios,
    delete_logic: delUsuario
};