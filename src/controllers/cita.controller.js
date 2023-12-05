const Cita = require("../models/cita.model");
const Historial = require("../models/historial.model");
const db = require("../configs/db.config");
const {verify} = require("jsonwebtoken");

const index = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const offset = (page - 1) * limit;
        const {sort, order} = req.query;

        const cita = await Cita.getAll({offset, limit}, {sort, order});

        let response = {
            message: "cita obtenida exitosamente",
            data: cita
        };

        if (page && limit) {
            const totalCita = await Cita.count();
            response = {
                ...response,
                total: totalCita,
                totalPages: Math.ceil(totalCita / limit),
                currentPage: page
            };
        }

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al obtener la cita",
            error: error.message
        });
    }
}

const getById = async (req, res) => {
    try {
        const idCita = req.params.id;
        const cita = await Cita.getById(idCita);

        if (!cita) {
            return res.status(404).json({
                message: `no se encontró la cita con id ${idCita}`
            });
        }

        return res.status(200).json({
            message: "cita encontrada exitosamente",
            cita: cita
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al obtener la cita",
            error: error.message
        });
    }
}

const create = async (req, res) => {
    try {
        const token = req.get('aToken');
        const idUsuario = verify(token, process.env.SECRET).usuario.id;
        const cita = new Cita({
            motivo: req.body.motivo,
            fecha: req.body.fecha,
            id_usuario: idUsuario,
            id_cliente: req.body.id_cliente
        });

        await cita.save()

        return res.status(200).json({
            message: "cita creada exitosamente",
            cita: cita
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al crear la cita",
            error: error.message
        });
    }
}

const deleteLogic = async (req, res) => {
    try {
        const idCita = req.params.id;
        const token = req.get('aToken');
        const idUsuario = verify(token, process.env.SECRET).usuario.id;

        await Cita.deleteLogicoById(idCita, idUsuario);

        return res.status(200).json({
            message: "se eliminó la cita correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al eliminar la cita",
            error: error.message
        })
    }
}

const deleteFisico = async (req, res) => {
    try {
        const idCita = req.params.id;

        await Cita.deleteFisicoById(idCita);

        return res.status(200).json({
            message: "se eliminó la cita correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al eliminar la cita",
            error: error.message
        })
    }
}

const update = async (req, res) => {
    try {
        const idCita = req.params.id;
        const token = req.get('aToken');
        const idUsuario = verify(token, process.env.SECRET).usuario.id;
        const datosActualizar = {
            motivo: req.body.motivo,
            fecha: req.body.fecha,
            id_usuario: idUsuario
        }

        await Cita.updateById(idCita, datosActualizar);

        return res.status(200).json({
            message: "la cita se actualizó correctamente"
        })
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al actualizar la cita",
            error: error.message
        })
    }
}

const completarCita = async (req, res) => {
    const connection = await db.createConnection();

    try {
        await connection.beginTransaction();

        const idCita = req.params.id;
        const token = req.get('aToken');
        const idUsuario = verify(token, process.env.SECRET).usuario.id;

        await Cita.deleteWithTransaction(connection, idCita, idUsuario);

        const historial = new Historial({
            id_cliente: req.body.id_cliente,
            motivo: req.body.motivo,
            diagnostico: req.body.diagnostico,
            id_usuario: idUsuario
        });

        await historial.saveWithTransaction(connection);

        await connection.commit();

        return res.status(200).json({
            message: "la cita se completó correctamente"
        })
    } catch (error) {
        await connection.rollback();

        return res.status(500).json({
            message: "ocurrió un error al completar la cita",
            error: error.message
        })

    }
}

module.exports = {
    index,
    getById,
    create,
    deleteLogic,
    update,
    completarCita
}