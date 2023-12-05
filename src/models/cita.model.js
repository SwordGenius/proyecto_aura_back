const db = require('../configs/db.config');
const pusher = require('../configs/pusher.config');

class Cita {

    constructor({ id, id_usuario, id_cliente, motivo, fecha, deletedBy, createdBy, updatedBy, deleted, createdAt, updatedAt, deletedAt }) {
        this.id = id;
        this.id_usuario = id_usuario;
        this.id_cliente = id_cliente;
        this.motivo = motivo;
        this.fecha = fecha;
        this.deleted = deleted;
        this.deletedBy = deletedBy;
        this.createdAt = createdAt;
        this.createdBy = createdBy;
        this.updatedAt = updatedAt;
        this.updatedBy = updatedBy;
        this.deletedAt = deletedAt;
    }

    static async getAll({ offset, limit }, { sort, order }) {
        const connection = await db.createConnection();
        let query = "SELECT id_cita, id_cliente, id_usuario, motivo, fecha_cita, deleted, created_at, updated_at, deleted_at FROM cita WHERE deleted = 0";

        if (sort && order) {
            query += ` ORDER BY ${sort} ${order}`
        }

        if (offset >= 0 && limit) {
            query += ` LIMIT ${offset}, ${limit}`;
        }

        const [rows] = await connection.query(query);
        connection.end();

        return rows;
    }

    static async getById(id) {
        const connection = await db.createConnection();
        const [rows] = await connection.execute("SELECT id_cita, id_cliente, id_usuario, motivo, fecha_cita, deleted, created_at, updated_at, deleted_at FROM cita WHERE id_cita = ? AND deleted = 0", [id]);
        connection.end();

        if (rows.length > 0) {
            const row = rows[0];
            return new Cita({ id: row.id, id_cliente: row.id_cliente, id_usuario: row.id_usuario, motivo: row.motivo, fecha: row.fecha_cita, deleted: row.deleted, createdAt: row.created_at, updatedAt: row.updated_at, deletedAt: row.deleted_at });
        }

        return null;
    }

    static async deleteLogicoById(id, id_usuario){
        const connection = await db.createConnection();

        const deletedAt = new Date();
        const [result] = connection.execute("UPDATE cita SET deleted = 1, deleted_at = ?, deleted_by = ? WHERE id_cita = ?", [deletedAt, id_usuario, id]);

        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("No se pudo eliminar la cita");
        }

        await pusher.trigger('citas', 'eliminar', {
            message: "se eliminó una cita",
        })
        return result
    }

    static async deleteFisicoById(id) {
        const connection = await db.createConnection();
        const [result] = await connection.execute("DELETE FROM cita WHERE id_cita = ?", [id]);
        connection.end();

        if (result.affectedRows == 0) {
            throw new Error("no se eliminó la cita");
        }

        return result;
    }

    static async updateById(id, { motivo, fecha, id_usuario }) {
        const connection = await db.createConnection();
        const updatedAt = new Date();
        const [result] = await connection.execute("UPDATE cita SET motivo = ?, fecha_cita = ?, updated_at = ?, updated_by = ? WHERE id_cliente = ?", [motivo, fecha, updatedAt, id_usuario, id]);

        if (result.affectedRows === 0) {
            throw new Error("no se actualizó la cita");
        }

        return result;
    }

    static async count() {
        const connection = await db.createConnection();
        const [rows] = await connection.query("SELECT COUNT(*) AS totalCount FROM cita WHERE deleted = 0");
        connection.end();

        return rows[0].totalCount;
    }

    async save() {
        const connection = await db.createConnection();
        const [result] = await connection.execute("INSERT INTO cita (id_cliente, id_usuario, motivo, fecha_cita, created_by) VALUES (?, ?, ?, ?, ?)", [this.id_cliente, this.id_usuario, this.motivo, this.fecha, this.id_usuario]);
        connection.end();

        if (result.insertId === 0) {
            throw new Error("No se insertó la cita");
        }

        this.id = result.insertId;
        this.deleted = 0;
        this.createdAt = new Date();
        this.updatedAt = null;
        this.deletedAt = null;

        await pusher.trigger('citas', 'agregar', {
            message: "Una cita se ha agregado",
        })
        return this.id;
    }
    static async deleteWithTransaction(connection, id_usuario, id_cita) {
        const deletedAt = new Date();
        const [result] = await connection.execute("UPDATE cita SET deleted = 1, deleted_at = ?, deleted_by = ? WHERE id_cita = ?", [deletedAt, id_usuario, id_cita]);

        if (result.affectedRows === 0) {
            throw new Error("No se pudo eliminar la cita");
        }

        return result;
    }
}

module.exports = Cita;