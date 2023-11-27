const db = require('../configs/db.config');
const {uploadFile, getURL} = require("../helpers/uploads.helper");
const pusher = require('../configs/pusher.config');

class Cliente {

    constructor({ id, id_usuario, apellido_p, apellido_m, nombre, notas, fotografia, edad, deleted, createdAt, updatedAt, deletedAt, deletedBy, createdBy, updatedBy }) {
        this.id = id;
        this.id_usuario = id_usuario;
        this.nombre = nombre;
        this.apellido_p = apellido_p;
        this.apellido_m = apellido_m;
        this.notas = notas;
        this.fotografia = fotografia;
        this. edad = edad;
        this.deleted = deleted;
        this.deletedBy = deletedBy;
        this.createdAt = createdAt;
        this.createdBy = createdBy;
        this.updatedAt = updatedAt;
        this.updatedBy = updatedBy;
        this.deletedAt = deletedAt;
    }

    static async getAll({ offset, limit }, { sort, order }, id) {
        const connection = await db.createConnection();

        let query = `SELECT id_cliente, id_usuario, nombre, apellido_paterno, apellido_materno, notas, fotografia, edad, deleted, created_at, updated_at, deleted_at FROM cliente WHERE deleted = 0 AND id_usuario = ${id}`;

        if (sort && order) {
            query += ` ORDER BY ${sort} ${order}`
        }
        if (offset >= 0 && limit) {
            query += ` LIMIT ${offset}, ${limit}`;
        }
        const [rows] = await connection.query(query)
        connection.end();

        return rows;
    }

    static async getById(id) {
        const connection = await db.createConnection();
        const [rows] = await connection.execute("SELECT id_cliente, id_usuario, nombre, apellido_paterno, apellido_materno, notas, fotografia, edad, deleted, created_at, updated_at, deleted_at FROM cliente WHERE id_cliente = ? AND deleted = 0", [id]);
        connection.end();

        if (rows.length > 0) {
            const row = rows[0];
            return new Cliente({ id: row.id, id_usuario: row.id_usuario, nombre: row.nombre, apellido_p: row.apellido_p, apellido_m: row.apellido_m, notas: row.notas, fotografia: row.fotografia, edad: row.edad, deleted: row.deleted, createdAt: row.created_at, updatedAt: row.updated_at, deletedAt: row.deleted_at });
        }

        return null;
    }

    static async deleteLogicoById(id, id_usuario){
        console.log(id, id_usuario);
        const connection = await db.createConnection();

        const deletedAt = new Date();
        const [result] = connection.execute("UPDATE cliente SET deleted = 1, deleted_at = ?, deleted_by = ? WHERE id_cliente = ?", [deletedAt, id_usuario, id]);
        console.log(result)
        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("No se pudo eliminar el cliente");
        }
        await pusher.trigger('clientes', 'eliminar', {
            message: 'Un cliente se ha eliminado'
        });
        return result
    }

    static async deleteFisicoById(id) {
        const connection = await db.createConnection();
        const [result] = await connection.execute("DELETE FROM cliente WHERE id_cliente = ?", [id]);
        connection.end();

        if (result.affectedRows == 0) {
            throw new Error("no se eliminó el cliente");
        }

        return result;
    }

    static async updateById(id, { email, password, nombre, apellido_p, apellido_m, file, notas, edad, id_usuario }) {
        const connection = await db.createConnection();
        const uploaded = await uploadFile(file);
        if (!uploaded) {
            throw new Error("No se pudo subir el archivo");
        }
        const URL = await getURL(file);
        const updatedAt = new Date();
        const [result] = await connection.execute("UPDATE cliente SET nombre = ?, apellido_paterno = ?, apellido_materno = ?, notas = ?, fotografia = ?, edad = ?, updated_at = ?, updated_by WHERE id_cliente = ?", [email, password, nombre, apellido_p, apellido_m, notas, URL, edad, updatedAt, id_usuario, id]);

        if (result.affectedRows === 0) {
            throw new Error("no se actualizó el cliente");
        }

        return result;
    }

    static async count() {
        const connection = await db.createConnection();
        const [rows] = await connection.query("SELECT COUNT(*) AS totalCount FROM cliente WHERE deleted = 0");
        connection.end();

        return rows[0].totalCount;
    }

    async save() {
        const connection = await db.createConnection();
        console.log(this.apellido_p, this.apellido_m, this.nombre, this.edad, this.id_usuario);
        const [result] = await connection.execute("INSERT INTO cliente (id_usuario, nombre, apellido_paterno, apellido_materno, edad, created_by) VALUES (?, ?, ?, ?, ?, ?)", [this.id_usuario , this.nombre, this.apellido_p, this.apellido_m, this.edad, this.id_usuario]);
        connection.end();

        if (result.insertId === 0) {
            throw new Error("No se insertó el cliente");
        }

        this.id = result.insertId;
        this.deleted = 0;
        this.createdAt = new Date();
        this.updatedAt = null;
        this.deletedAt = null;



        await pusher.trigger('clientes', 'agregar', {
            message: 'Un cliente se ha agregado'
        });

        return this.id;
    }
}

module.exports = Cliente;