const Cliente = require("../models/cliente.model");
const {verify} = require("jsonwebtoken");

const index = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const token = req.cookies.aToken;
        const id = verify(token, process.env.SECRET).usuario._id;
        const offset = (page - 1) * limit;
        const {sort, order} = req.query;

        const cliente = await Cliente.getAll({offset, limit}, {sort, order}, id);
        let response = {
            message: "cliente obtenido exitosamente",
            data: cliente
        };

        if (page && limit) {
            const totalCliente = await Cliente.count();
            response = {
                ...response,
                total: totalCliente,
                totalPages: Math.ceil(totalCliente / limit),
                currentPage: page
            };
        }

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al obtener el cliente",
            error: error.message
        });
    }
}

const getById = async (req, res) => {
    try {
        const idCliente = req.params.id;
        const cliente = await Cliente.getById(idCliente);
        if (!cliente) {
            return res.status(404).json({
                message: `no se encontró el cliente con id ${idCliente}`
            });
        }
        return res.status(200).json({
            message: "cliente encontrado exitosamente",
            cliente: cliente
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al obtener el cliente",
            error: error.message
        });
    }
}

const create = async (req, res) => {
    try {
        const token = req.cookies.aToken;
        const idUsuario = verify(token, process.env.SECRET).usuario._id;
        const cliente = new Cliente({
            nombre: req.body.nombre,
            apellido_p: req.body.apellido_P,
            apellido_m: req.body.apellido_M,
            edad: req.body.edad,
            id_usuario: idUsuario
        });
        const id = await cliente.save()
        return res.status(200).json({
            message: "cliente creado exitosamente",
            cliente: cliente,
            id: id
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al crear el cliente",
            error: error.message
        });
    }
}

const deleteLogic = async (req, res) => {
    try {
        const idCliente = req.params.id;
        console.log(idCliente)
        const token = req.cookies.aToken;
        console.log(token)
        const idUsuario = verify(token, process.env.SECRET).usuario._id;
        console.log(idUsuario)


        await Cliente.deleteLogicoById(idCliente, idUsuario);

        return res.status(200).json({
            message: "se eliminó el cliente correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al eliminar el cliente",
            error: error.message
        })
    }
}

const deleteFisico = async (req, res) => {
    try {
        const idCliente = req.params.id;

        await Cliente.deleteFisicoById(idCliente);

        return res.status(200).json({
            message: "se eliminó el cliente correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al eliminar el cliente",
            error: error.message
        })
    }
}

const update = async (req, res) => {
    try {
        const idCliente = req.params.id;
        const token = req.get('aToken');
        const idUsuario = verify(token, process.env.SECRET).usuario.id;
        const datosActualizar = {
            nombre: req.body.nombre,
            apellido_p: req.body.apellido_p,
            apellido_m: req.body.apellido_m,
            edad: req.body.edad,
            notas: req.body.notas,
            fotografia: req.body.fotografia,
            id_usuario: idUsuario
        }

        await Cliente.updateById(idCliente, datosActualizar);

        return res.status(200).json({
            message: "el cliente se actualizó correctamente"
        })
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al actualizar el cliente",
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