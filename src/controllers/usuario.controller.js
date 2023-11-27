const Usuario = require('../models/usuario.model');
const bcrypt = require('bcrypt');
const {verify} = require("jsonwebtoken");
const saltosBcrypt = parseInt(process.env.BCRYPT);

const index = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const offset = (page - 1) * limit;
        const {sort, order} = req.query;

        const usuarios = await Usuario.getAll({offset, limit}, {sort, order});

        let response = {
            message: "usuarios obtenidos exitosamente",
            data: usuarios
        };

        if (page && limit) {
            const totalUsuarios = await Usuario.count();
            response = {
                ...response,
                total: totalUsuarios,
                totalPages: Math.ceil(totalUsuarios / limit),
                currentPage: page
            };
        }

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al obtener los usuarios",
            error: error.message
        });
    }
}

const getById = async (req, res) => {
    try {
        const idUsuario = req.params.id;
        const usuario = await Usuario.getById(idUsuario);

        if (!usuario) {
            return res.status(404).json({
                message: `no se encontró el usuario con id ${idUsuario}`
            });
        }

        return res.status(200).json({
            message: "usuario encontrado exitosamente",
            usuario
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al obtener el usuario",
            error: error.message
        });
    }
}
const getByCookie = async (req, res) => {
    try {
        const token = req.cookies.aToken;
        const idUsuario = verify(token, process.env.SECRET).usuario._id;
        const usuario = await Usuario.getById(idUsuario);

        if (!usuario) {
            return res.status(404).json({
                message: `no se encontró el usuario con id ${idUsuario}`
            });
        }

        return res.status(200).json({
            message: "usuario encontrado exitosamente",
            usuario
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al obtener el usuario",
            error: error.message
        });
    }
}

const create = async (req, res) => {
    try {
        const usuario = new Usuario({
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, saltosBcrypt),
            nombre: req.body.nombre,
            apellido_p: req.body.apellido_p,
            apellido_m: req.body.apellido_m,
        });
        await usuario.save()
        return res.status(200).json({
            message: "usuario creado exitosamente",
            usuario
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "ocurrió un error al crear el usuario",
            error: error.message
        });
    }
}

const deleteLogic = async (req, res) => {
    try {
        const idUsuario = req.params.id;

        await Usuario.deleteLogicoById(idUsuario);

        return res.status(200).json({
            message: "se eliminó el usuario correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al eliminar el usuario",
            error: error.message
        })
    }
}

const deleteFisico = async (req, res) => {
    try {
        const idUsuario = req.params.id;

        await Usuario.deleteFisicoById(idUsuario);

        return res.status(200).json({
            message: "se eliminó el usuario correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al eliminar el usuario",
            error: error.message
        })
    }
}

const update = async (req, res) => {
    try {
        const idUsuario = req.params.id;
        const datosActualizar = {
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, saltosBcrypt),
            nombre: req.body.nombre,
            apellido_p: req.body.apellido_p,
            apellido_m: req.body.apellido_m,
            file: req.files.fotografia
        }

        await Usuario.updateById(idUsuario, datosActualizar);

        return res.status(200).json({
            message: "el usuario se actualizó correctamente"
        })
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al actualizar el usuario",
            error: error.message
        })
    }
}

const updatePartial = async(req, res) => {
    try {
        const idUsuario = req.params.id;
        const datosActualizar = {
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, saltosBcrypt),
            nombre: req.body.nombre,
            apellido_p: req.body.apellido_p,
            apellido_m: req.body.apellido_m,
            file: req.files.fotografia
        }

        await Usuario.updatePartialById(idUsuario, datosActualizar);

        return res.status(200).json({
            message: "el usuario se actualizó correctamente"
        })
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al actualizar el usuario",
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
    getByCookie
}