const db = require('../configs/db.config');
const {uploadFile, getURL} = require("../helpers/uploads.helper");
const url = require("url");

class Documento {

    constructor({ id, id_cliente, id_usuario, tipo_documento, documento_pdf, deletedBy, createdBy, updatedBy, deleted, createdAt, updatedAt, deletedAt }) {
        this.id = id;
        this.id_cliente = id_cliente;
        this.id_usuario = id_usuario;
        this.tipo_documento = tipo_documento;
        this.documento_pdf = documento_pdf;
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
        let query = `SELECT id_documento, id_cliente, tipo_documento, documento_pdf, deleted, created_at, updated_at, deleted_at FROM documento WHERE deleted = 0 AND id_cliente = ${id}`;

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
        const [rows] = await connection.execute("SELECT id_documento, id_cliente, tipo_documento, documento_pdf, deleted, created_at, updated_at, deleted_at FROM documento WHERE id_documento = ? AND deleted = 0", [id]);
        connection.end();

        if (rows.length > 0) {
            const row = rows[0];
            return new Documento({ id: row.id, id_usuario: row.id_usuario, tipo_documento: row.tipo_documento, documento_pdf: row.documento_pdf, deleted: row.deleted, createdAt: row.created_at, updatedAt: row.updated_at, deletedAt: row.deleted_at });
        }

        return null;
    }

    static async deleteLogicoById(id, id_usuario){
        const connection = await db.createConnection();

        const deletedAt = new Date();
        const [result] = connection.execute("UPDATE documento SET deleted = 1, deleted_at = ?, deleted_by = ? WHERE id_documento = ?", [deletedAt, id_usuario, id]);

        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("No se pudo eliminar el documento");
        }

        return result
    }

    static async deleteFisicoById(id) {
        const connection = await db.createConnection();
        const [result] = await connection.execute("DELETE FROM documento WHERE id_documento = ?", [id]);
        connection.end();

        if (result.affectedRows == 0) {
            throw new Error("no se eliminó el documento");
        }

        return result;
    }

    static async updateById(id, { tipo_documento, documento_pdf, id_usuario }) {
        const connection = await db.createConnection();
        const uploaded = await uploadFile(documento_pdf);
        if (!uploaded) {
            throw new Error("No se pudo subir el archivo");
        }
        const URL = await getURL(documento_pdf);
        const updatedAt = new Date();
        const [result] = await connection.execute("UPDATE documento SET tipo_documento = ?, documento_pdf = ?, updated_at = ?, updated_by = ? WHERE id_cliente = ?", [tipo_documento, URL, updatedAt, id_usuario, id]);

        if (result.affectedRows === 0) {
            throw new Error("no se actualizó el documento");
        }

        return result;
    }

    static async count() {
        const connection = await db.createConnection();
        const [rows] = await connection.query("SELECT COUNT(*) AS totalCount FROM documento WHERE deleted = 0");
        connection.end();

        return rows[0].totalCount;
    }

    async save() {
        const connection = await db.createConnection();
        const uploaded = await uploadFile(this.documento_pdf);
        if (!uploaded) {
            throw new Error("No se pudo subir el archivo");
        }

        const URL = await getURL(this.documento_pdf);
        console.log(this.id_cliente, this.tipo_documento, URL, this.id_usuario)
        const [result] = await connection.execute("INSERT INTO documento (id_cliente, tipo_documento, documento_pdf, created_by) VALUES (?, ?, ?, ?)", [this.id_cliente ,this.tipo_documento, URL, this.id_usuario]);
        connection.end();


        if (result.insertId === 0) {
            throw new Error("No se insertó el documento");
        }

        this.id = result.insertId;
        this.deleted = 0;
        this.createdAt = new Date();
        this.updatedAt = null;
        this.deletedAt = null;

        return this.id;
    }
}

module.exports = Documento;