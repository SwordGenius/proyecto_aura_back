const dotenv = require("dotenv");
dotenv.config();

const {connection} = require("../configs/db");
const fs = require("fs");
const path = require("path");
const {getImageType} = require("../helpers/image.helper");
const {verify} = require("jsonwebtoken");

const indexCliente = async (request, response) => {
    const { page, limit } = request.query;
    const skip = (page - 1) * limit;
    let query;
    if (page && limit) {
        query ="SELECT * FROM cliente WHERE deleted = false LIMIT ?, ?"
    }
    else {
        query ="SELECT * FROM cliente WHERE deleted = false"
    }
    connection.query(query,
        [skip, limit],
        (error, results) => {
            if(error)
                throw error;
            results?.map(img => {
                console.log(img)
                fs.writeFileSync(path.join(__dirname, '../dbimagesClient/' + img.fotografia + getImageType(img.fotografia)), img.fotografia)
            })
            const imagedir = fs.readdirSync(path.join(__dirname, '../dbimagesClient/'));
            results?.map((img, index) => {
                img.fotografia = imagedir[index];
            });
            let res = {
                message: "se obtuvieron correctamente los clientes",
                data: results
            }
            if (page && limit) {
                const totalClientes = results.length;
                const totalPages = Math.ceil(totalClientes / limit);

                res = {
                    ...res,
                    total: totalClientes,
                    totalPages,
                }
            }

            return response.status(200).json(res);
        });
};
const getByCliente = async (request, response) => {
    const id = request.params.id;
    connection.query("SELECT * FROM usuario WHERE email = ?",
        [id],
        (error, results) => {
            if(error)
                return response.status(500).json({
                    message: "ocurrió un error al obtener el cliente",
                    error: error.message
                });
            response.status(200).json({
                message: "se obtuvo el cliente correctamente",
                results,
            });
        });
}
const postCliente = async (request, response) => {
    const {nombre, apellido_P, apellido_M, proposito, edad} = request.body;
    connection.query("INSERT INTO usuario(nombre, apellido_paterno, apellido_materno, proposito, edad, deleted, created_at) VALUES (?,?,?,?,?,?,?) ",
        [nombre, apellido_P, apellido_M, proposito, parseInt(edad), false, new Date()],
        (error, results) => {
            if(error)
                throw error;
            response.status(201).json({"Item añadido correctamente": results.affectedRows});
        });
};

const patchCliente = async (request, response) => {
    const id = request.params.id;
    const updatedFields = request.body;
    const token = request.get('aToken');
    const idUsuario = verify(token, process.env.SECRET).usuario._id;
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
    connection.query(`UPDATE cliente SET ${campos.join(',')}, updated_by, updated_at = ? WHERE id_usuarios = ?`,
        [...valores, idUsuario, new Date(), id],
        (error, results) => {
            if(error)
                return response.status(500).json({
                    mensaje: "no se pudo actualizar el cliente",
                    error: error.message
                });
            response.status(201).json({"Item actualizado":results.affectedRows});
        });
}

const putCliente = async (request, response) => {
    const token = request.get('aToken');
    const idUsuario = verify(token, process.env.SECRET).usuario._id;
    const id = request.params.id;
    const {nombre, apellido_P, apellido_M, edad} = request.body;
    const data = fs.readFileSync(path.join(__dirname, '../images/' + request.file.filename))
    connection.query("UPDATE cliente SET nombre = ?, apellido_paterno = ?, apellido_materno = ?, fotografia = ?, edad = ?, updated_by = ?, updated_at = ?, deleted = ? WHERE id_usuarios = ?",
        [nombre, apellido_P, apellido_M, data, edad, idUsuario, new Date(), false, id],
        (error, results) => {
            if(error)
                return response.status(500).json({
                    mensaje: "no se pudo actualizar el cliente",
                    error: error.message
                });
            response.status(201).json({"Item actualizado":results.affectedRows});
        });
}
const delCliente = async (request, response) => {
    const token = request.get('aToken');
    const idUsuario = verify(token, process.env.SECRET).usuario._id;
    const id = request.params.id;
    connection.query("UPDATE cliente SET deleted = ?, deleted_by, deleted_at = ? where id_usuarios = ?",
        [true, idUsuario, new Date(),id],
        (error, results) => {
            if(error)
                throw error;
            response.status(201).json({"Item eliminado":results.affectedRows});
        });
};



module.exports = {
    index: indexCliente,
    getById: getByCliente,
    create: postCliente,
    updatePartial: patchCliente,
    updateComplete: putCliente,
    delete_logic: delCliente
};