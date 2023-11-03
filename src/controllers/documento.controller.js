const dotenv = require("dotenv");
dotenv.config();


const {connection} = require("../configs/db");
const fs = require("fs");
const path = require("path");
const {getImageType} = require("../helpers/image.helper");
const {verify} = require("jsonwebtoken");

const indexDocumentos = async (request, response) => {
    const { page, limit } = request.query;
    const skip = (page - 1) * limit;
    let query;
    if (page && limit) {
        query ="SELECT * FROM documento WHERE deleted = false LIMIT ?, ?"
    }
    else {
        query ="SELECT * FROM documento WHERE deleted = false"
    }
    connection.query(query,
        [skip, limit],
        (error, results) => {
            if(error)
                throw error;
            results?.map(img => {
                console.log(img)
                fs.writeFileSync(path.join(__dirname, '../dbimagesDocument/' + img.fotografia + getImageType(img.fotografia)), img.fotografia)
            })
            const imagedir = fs.readdirSync(path.join(__dirname, '../dbimagesDocument/'));
            results?.map((img, index) => {
                img.fotografia = imagedir[index];
            });
            let res = {
                message: "se obtuvieron correctamente los documentos",
                data: results
            }

            if (page && limit) {
                const totalDocumentos = results.length;
                const totalPages = Math.ceil(totalDocumentos / limit);

                res = {
                    ...res,
                    total: totalDocumentos,
                    totalPages,
                }
            }

            return response.status(200).json(res);
        });
};
const getByDocumento = async (request, response) => {
    const id = request.params.id;
    connection.query("SELECT * FROM documento WHERE email = ?",
        [id],
        (error, results) => {
            if(error)
                return response.status(500).json({
                    message: "ocurrió un error al obtener el documento",
                    error: error.message
                });
            response.status(200).json({
                message: "se obtuvo el documento correctamente",
                results,
            });
        });
}
const postDocumento = async (request, response) => {
    const {id_cliente, tipo_documento} = request.body;
    const data = fs.readFileSync(path.join(__dirname, '../images/' + request.file.filename))
    connection.query("INSERT INTO documento( id_cliente, tipo_documento, documento_pdf, deleted, created_at) VALUES (?,?,?,?,?) ",
        [ id_cliente, tipo_documento, data, false, new Date()],
        (error, results) => {
            if(error)
                throw error;
            response.status(201).json({"Item añadido correctamente": results.affectedRows});
        });
};

const patchDocumento = async (request, response) => {
    const token = request.get('aToken');
    const idUsuario = verify(token, process.env.SECRET).usuario._id;
    const id = request.params.id;
    const updatedFields = request.body;
    const campos = [];
    const valores = [];

    if (request.file) {
        campos.push('documento_pdf = ?');
        valores.push(fs.readFileSync(path.join(__dirname, '../images/' + request.file.filename)));
    }

    for (const key in updatedFields) {
        campos.push(`${key} = ?`);
        valores.push(updatedFields[key]);
    }

    if (campos.length === 0) {
        return response.status(400).json({ error: 'No se proporcionaron campos para actualizar.' });
    }
    connection.query(`UPDATE documento SET ${campos.join(',')}, updated_by = ?, updated_at = ? WHERE id_usuarios = ?`,
        [...valores, idUsuario, new Date(), id],
        (error, results) => {
            if(error)
                return response.status(500).json({
                    mensaje: "no se pudo actualizar el usuario",
                    error: error.message
                });
            response.status(201).json({"Item actualizado":results.affectedRows});
        });
}

const putDocumento = async (request, response) => {
    const token = request.get('aToken');
    const idUsuario = verify(token, process.env.SECRET).usuario._id;
    const id = request.params.id;
    const {tipo_documento} = request.body;
    const data = fs.readFileSync(path.join(__dirname, '../images/' + request.file.filename))
    connection.query("UPDATE documento SET id_cliente = ?, tipo_documento = ?, documento_pdf = ?, updated_by, updated_at = ? WHERE id_usuarios = ?",
        [id, tipo_documento, data, idUsuario, new Date(), id],
        (error, results) => {
            if(error)
                return response.status(500).json({
                    mensaje: "no se pudo actualizar el usuario",
                    error: error.message
                });
            response.status(201).json({"Item actualizado":results.affectedRows});
        });
}
const delDocumento = async (request, response) => {
    const token = request.get('aToken');
    const idUsuario = verify(token, process.env.SECRET).usuario._id;
    const id = request.params.id;
    connection.query("UPDATE documento SET deleted = ?, deleted_by, deleted_at = ? where id_usuarios = ?",
        [true, idUsuario, new Date(),id],
        (error, results) => {
            if(error)
                throw error;
            response.status(201).json({"Item eliminado":results.affectedRows});
        });
};



module.exports = {
    index: indexDocumentos,
    getById: getByDocumento,
    create: postDocumento,
    updatePartial: patchDocumento,
    updateComplete: putDocumento,
    delete_logic: delDocumento
};