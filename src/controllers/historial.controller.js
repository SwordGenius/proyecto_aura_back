const Historial = require("../models/historial.model");
const {verify} = require("jsonwebtoken");

const index = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const id = parseInt(req.query.id);
        const offset = (page - 1) * limit;
        const {sort, order} = req.query;

        const historial = await Historial.getAll({offset, limit}, {sort, order}, id);

        let response = {
            message: "historial obtenido exitosamente",
            data: historial
        };

        if (page && limit) {
            const totalHistorial = await Historial.count();
            response = {
                ...response,
                total: totalHistorial,
                totalPages: Math.ceil(totalHistorial / limit),
                currentPage: page
            };
        }

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al obtener el historial",
            error: error.message
        });
    }
}

const getById = async (req, res) => {
    try {
        const idHistorial = req.params.id;
        const historial = await Historial.getById(idHistorial);

        if (!historial) {
            return res.status(404).json({
                message: `no se encontró el historial con id ${idHistorial}`
            });
        }

        return res.status(200).json({
            message: "historial encontrado exitosamente",
            historial
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al obtener el historial",
            error: error.message
        });
    }
}

const create = async (req, res) => {
    try {
        const token = req.get('aToken');
        const idUsuario = verify(token, process.env.SECRET).usuario.id;
        const historial = new Historial({
            motivo: req.body.motivo,
            diagnostico: req.body.diagnostico,
            usuario_id: idUsuario
        });

        await historial.save()

        return res.status(200).json({
            message: "historial creado exitosamente",
            historial
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al crear el historial",
            error: error.message
        });
    }
}

const deleteLogic = async (req, res) => {
    try {
        const idHistorial = req.params.id;
        const token = req.get('aToken');
        const idUsuario = verify(token, process.env.SECRET).usuario.id;
        await Historial.deleteLogicoById(idHistorial, idUsuario);

        return res.status(200).json({
            message: "se eliminó el historial correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al eliminar el historial",
            error: error.message
        })
    }
}

const deleteFisico = async (req, res) => {
    try {
        const idHistorial = req.params.id;

        await Historial.deleteFisicoById(idHistorial);

        return res.status(200).json({
            message: "se eliminó el historial correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al eliminar el historial",
            error: error.message
        })
    }
}

const update = async (req, res) => {
    try {
        const idHistorial = req.params.id;
        const token = req.get('aToken');
        const idUsuario = verify(token, process.env.SECRET).usuario.id;
        const datosActualizar = {
            motivo: req.body.motivo,
            diagnostico: req.body.diagnostico,
            usuario_id: idUsuario
        }

        await Historial.updateById(idHistorial, datosActualizar);

        return res.status(200).json({
            message: "el historial se actualizó correctamente"
        })
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al actualizar el historial",
            error: error.message
        })
    }
}

module.exports = {
    index,
    getById,
    create,
    deleteLogic,
    update
}