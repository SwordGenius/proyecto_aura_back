const db = require('../configs/db.config');
class Historial {

    constructor({ id, idCliente, motivo, diagnostico, deleted, createdAt, updatedAt, deletedAt, createdBy, updatedBy, deletedBy }, usuario_id) {
        this.id = id;
        this.usuario_id = usuario_id;
        this.idCliente = idCliente;
        this.motivo = motivo;
        this.diagnostico = diagnostico;
        this.deleted = deleted;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.deletedBy = deletedBy;
    }

    static async getAll({ offset, limit }, { sort, order }, id) {
        const connection = await db.createConnection();
        let query = `SELECT id_historial, id_cliente, motivo, diagnostico, deleted, created_at, updated_at, deleted_at FROM historial WHERE deleted = 0 AND id_cliente = ${id}`;

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
        const [rows] = await connection.execute("SELECT id_historial, id_cliente, motivo, diagnostico, deleted, created_at, updated_at, deleted_at FROM historial WHERE id_historial = ? AND deleted = 0", [id]);
        connection.end();

        if (rows.length > 0) {
            const row = rows[0];
            return new Historial({ id: row.id_historial, idCliente: row.id_cliente, motivo: row.motivo, diagnostico: row.diagnostico, deleted: row.deleted, createdAt: row.created_at, updatedAt: row.updated_at, deletedAt: row.deleted_at, createdBy: row.created_by, updatedBy: row.updated_by, deletedBy: row.deleted_by});
        }

        return null;
    }

    static async deleteLogicoById(id, usuario_id){
        const connection = await db.createConnection();

        const deletedAt = new Date();
        const [result] = connection.execute("UPDATE historial SET deleted = 1, deleted_at = ?, deleted_by = ? WHERE id_historial = ?", [deletedAt, usuario_id, id]);

        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("No se pudo eliminar el historial");
        }

        return
    }

    static async deleteFisicoById(id) {
        const connection = await db.createConnection();
        const [result] = await connection.execute("DELETE FROM historial WHERE id_historial = ?", [id]);
        connection.end();

        if (result.affectedRows == 0) {
            throw new Error("no se eliminó el historial");
        }

        return result
    }

    static async updateById(id, { motivo, diagnostico, usuario_id }) {
        const connection = await db.createConnection();

        const updatedAt = new Date();
        const [result] = await connection.execute("UPDATE historial SET motivo = ?, didagnostico = ?, updated_at = ?, updated_by = ? WHERE id_historial = ?", [motivo, diagnostico, updatedAt, usuario_id, id]);

        if (result.affectedRows == 0) {
            throw new Error("no se actualizó el usuario");
        }

        return result
    }

    static async count() {
        const connection = await db.createConnection();
        const [rows] = await connection.query("SELECT COUNT(*) AS totalCount FROM historial WHERE deleted = 0");
        connection.end();

        return rows[0].totalCount;
    }

    async save() {
        const connection = await db.createConnection();

        const createdAt = new Date();
        const [result] = await connection.execute("INSERT INTO historial (id_cliente ,motivo, diagnostico, created_by) VALUES (?, ?, ?, ?)", [this.idCliente, this.motivo, this.diagnostico, this.usuario_id]);

        connection.end();

        if (result.insertId === 0) {
            throw new Error("No se insertó el historial");
        }

        this.id = result.insertId;
        this.deleted = 0;
        this.createdAt = new Date()
        this.updatedAt = null;
        this.deletedAt = null;

        return this.id
    }
    async saveWithTransaction(connection) {
        const createdAt = new Date();
        const [result] = await connection.execute("INSERT INTO historial (id_cliente ,motivo, diagnostico, created_by) VALUES (?, ?, ?, ?)", [this.idCliente, this.motivo, this.diagnostico, this.usuario_id]);

        if (result.insertId === 0) {
            throw new Error("No se insertó el historial");
        }

        return result.insertId;
    }
}

module.exports = Historial;