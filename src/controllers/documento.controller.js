const Documento = require("../models/documento.model");
const {verify} = require("jsonwebtoken");

const index = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const id = parseInt(req.query.id);
        const offset = (page - 1) * limit;
        const {sort, order} = req.query;

        const documento = await Documento.getAll({offset, limit}, {sort, order}, id);

        let response = {
            message: "documento obtenido exitosamente",
            data: documento
        };

        if (page && limit) {
            const totalDocumento = await Documento.count();
            response = {
                ...response,
                total: totalDocumento,
                totalPages: Math.ceil(totalDocumento / limit),
                currentPage: page
            };
        }

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al obtener el documento",
            error: error.message
        });
    }
}

const getById = async (req, res) => {
    try {
        const idDocumento = req.params.id;
        const documento = await Documento.getById(idDocumento);

        if (!documento) {
            return res.status(404).json({
                message: `no se encontró el documento con id ${idDocumento}`
            });
        }

        return res.status(200).json({
            message: "documento encontrado exitosamente",
            historial: documento
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al obtener el documento",
            error: error.message
        });
    }
}

const create = async (req, res) => {
    try {
        const token = req.cookies.aToken;
        const idUsuario = verify(token, process.env.SECRET).usuario._id;

        const documento = new Documento({
            tipo_documento: req.body.tipo_documento,
            documento_pdf: req.files.documento_pdf,
            id_usuario: idUsuario,
            id_cliente: req.body.id_cliente
        });

        await documento.save()

        return res.status(200).json({
            message: "documento creado exitosamente",
            documento: documento
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al crear el documento",
            error: error.message
        });
    }
}

const deleteLogic = async (req, res) => {
    try {
        const idDocumento = req.params.id;
        const token = req.get('aToken');
        const idUsuario = verify(token, process.env.SECRET).usuario.id;

        await Documento.deleteLogicoById(idDocumento, idUsuario);

        return res.status(200).json({
            message: "se eliminó el documento correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al eliminar el documento",
            error: error.message
        })
    }
}

const deleteFisico = async (req, res) => {
    try {
        const idDocumento = req.params.id;

        await Documento.deleteFisicoById(idDocumento);

        return res.status(200).json({
            message: "se eliminó el documento correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al eliminar el documento",
            error: error.message
        })
    }
}

const update = async (req, res) => {
    try {
        const idDocumento = req.params.id;
        const token = req.cookies.aToken;
        const idUsuario = verify(token, process.env.SECRET).usuario.id;
        const datosActualizar = {
            tipo_documento: req.body.tipo_documento,
            documento_pdf: req.body.files.documento_pdf,
            id_usuario: idUsuario
        }

        await Documento.updateById(idDocumento, datosActualizar);

        return res.status(200).json({
            message: "el documento se actualizó correctamente"
        })
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al actualizar el documento",
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