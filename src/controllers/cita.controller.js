const dotenv = require("dotenv");
dotenv.config();

const {connection} = require("../configs/db");
const {verify} = require("jsonwebtoken");

const indexCita = async (request, response) => {
    const { page, limit } = request.query;
    const skip = (page - 1) * limit;
    let query;
    if (page && limit) {
        query ="SELECT * FROM cita WHERE deleted = false LIMIT ?, ?"
    }
    else {
        query ="SELECT * FROM cita WHERE deleted = false"
    }
    connection.query(query,
        [skip, limit],
        (error, results) => {
            if(error)
                throw error;
            let res = {
                message: "se obtuvieron correctamente las citas",
                data: results
            }
            if (page && limit) {
                const totalCitas = results.length;
                const totalPages = Math.ceil(totalCitas / limit);

                res = {
                    ...res,
                    total: totalCitas,
                    totalPages,
                }
            }

            return response.status(200).json(res);
        });
};
const getByCita = async (request, response) => {
    const id = request.params.id;
    connection.query("SELECT * FROM cita WHERE id_cita = ?",
        [id],
        (error, results) => {
            if(error)
                return response.status(500).json({
                    message: "ocurrió un error al obtener el cliente",
                    error: error.message
                });
            response.status(200).json({
                message: "se obtuvo la cita correctamente",
                results,
            });
        });
}
const postCita = async (request, response) => {
    const token = request.get('aToken');
    const idUsuario = verify(token, process.env.SECRET).usuario.id;
    const {nombre, apellido_P, apellido_M, proposito, edad, motivo} = request.body;
    connection.query("INSERT INTO usuario(nombre, apellido_paterno, apellido_materno, proposito, edad, motivo, deleted, created_by, created_at) VALUES (?,?,?,?,?,?,?,?,?) ",
        [nombre, apellido_P, apellido_M, proposito, parseInt(edad), motivo, false, idUsuario, new Date()],
        (error, results) => {
            if(error)
                throw error;
            response.status(201).json({"Item añadido correctamente": results.affectedRows});
        });
};

const patchCita = async (request, response) => {
    const id = request.params.id;
    const updatedFields = request.body;
    const token = request.get('aToken');
    const idUsuario = verify(token, process.env.SECRET).usuario.id;
    const campos = [];
    const valores = [];

    for (const key in updatedFields) {
        campos.push(`${key} = ?`);
        valores.push(updatedFields[key]);
    }

    if (campos.length === 0) {
        return response.status(400).json({ error: 'No se proporcionaron campos para actualizar.' });
    }
    connection.query(`UPDATE cita SET ${campos.join(',')}, updated_by, updated_at = ? WHERE id_usuarios = ?`,
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

const putCita = async (request, response) => {
    const token = request.get('aToken');
    const idUsuario = verify(token, process.env.SECRET).usuario.id;
    const id = request.params.id;
    const {nombre, apellido_P, apellido_M, edad} = request.body;
    connection.query("UPDATE cita SET nombre = ?, apellido_paterno = ?, apellido_materno = ?, edad = ?, updated_by = ?, updated_at = ?, deleted = ? WHERE id_usuarios = ?",
        [nombre, apellido_P, apellido_M, edad, idUsuario, new Date(), false, id],
        (error, results) => {
            if(error)
                return response.status(500).json({
                    mensaje: "no se pudo actualizar el cliente",
                    error: error.message
                });
            response.status(201).json({"Item actualizado":results.affectedRows});
        });
}
const delCita = async (request, response) => {
    const token = request.get('aToken');
    const idUsuario = verify(token, process.env.SECRET).usuario.id;
    const id = request.params.id;
    connection.query("UPDATE cita SET deleted = ?, deleted_by, deleted_at = ? where id_cita = ?",
        [true, idUsuario, new Date(),id],
        (error, results) => {
            if(error)
                throw error;
            response.status(201).json({"Item eliminado":results.affectedRows});
        });
};



module.exports = {
    index: indexCita,
    getById: getByCita,
    create: postCita,
    updatePartial: patchCita,
    updateComplete: putCita,
    delete_logic: delCita
};