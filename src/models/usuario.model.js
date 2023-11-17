const db = require('../configs/db.config');

class Usuario {

    constructor({ id, email, password, nombre, deleted, createdAt, updatedAt, deletedAt }) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.nombre = nombre;
        this.deleted = deleted;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }

    static async getAll({ offset, limit }, { sort, order }) {
        const connection = await db.createConnection();
        let query = "SELECT id_usuario, email, password, deleted, created_at, updated_at, deleted_at FROM usuario WHERE deleted = 0";

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
        const [rows] = await connection.execute("SELECT id_usuario, email, password, nombre, deleted, created_at, updated_at, deleted_at FROM usuario WHERE id_usuario = ? AND deleted = 0", [id]);
        connection.end();

        if (rows.length > 0) {
            const row = rows[0];
            return new Usuario({ id: row.id, email: row.email, password: row.password, nombre: row.nombre, deleted: row.deleted, createdAt: row.created_at, updatedAt: row.updated_at, deletedAt: row.deleted_at });
        }

        return null;
    }

    static async deleteLogicoById(id) {
        const connection = await db.createConnection();

        const deletedAt = new Date();
        const [result] = connection.execute("UPDATE usuario SET deleted = 1, deleted_at = ? WHERE id_usuario = ?", [deletedAt, id]);

        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("No se pudo eliminar el usuario");
        }

        return result
    }

    static async deleteFisicoById(id) {
        const connection = await db.createConnection();
        const [result] = await connection.execute("DELETE FROM usuario WHERE id_usuario = ?", [id]);
        connection.end();

        if (result.affectedRows == 0) {
            throw new Error("no se eliminó el usuario");
        }

        return result;
    }

    static async updateById(id, { email, password, nombre }) {
        const connection = await db.createConnection();

        const updatedAt = new Date();
        const [result] = await connection.execute("UPDATE usuario SET email = ?, password = ?, nombre = ?, updated_at = ? WHERE id_usuario = ?", [email, password, nombre, updatedAt, id]);

        if (result.affectedRows === 0) {
            throw new Error("no se actualizó el usuario");
        }

        return result;
    }

    static async count() {
        const connection = await db.createConnection();
        const [rows] = await connection.query("SELECT COUNT(*) AS totalCount FROM usuario WHERE deleted = 0");
        connection.end();

        return rows[0].totalCount;
    }

    async save() {
        const connection = await db.createConnection();
        const [result] = await connection.execute("INSERT INTO usuario (email, password, nombre) VALUES (?, ?, ?)", [this.email, this.password, this.nombre]);

        connection.end();

        if (result.insertId === 0) {
            throw new Error("No se insertó el usuario");
        }

        this.id = result.insertId;
        this.deleted = 0;
        this.createdAt = createdAt;
        this.updatedAt = null;
        this.deletedAt = null;

        return this.id;
    }
}

module.exports = Usuario;