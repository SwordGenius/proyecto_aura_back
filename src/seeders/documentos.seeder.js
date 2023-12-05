const {connection} = require('../configs/db');

const documentos = [
    { id_cliente: "1", tipo_documento : "tipo1", documento_pdf : "pdf"},
    { id_cliente: "2", tipo_documento : "tipo2", documento_pdf : "pdf"},
    { id_cliente: "3", tipo_documento : "tipo3", documento_pdf : "pdf"},
    { id_cliente: "4", tipo_documento : "tipo4", documento_pdf : "pdf"},
    { id_cliente: "5", tipo_documento : "tipo5", documento_pdf : "pdf"},
    { id_cliente: "6", tipo_documento : "tipo6", documento_pdf : "pdf"},
    { id_cliente: "7", tipo_documento : "tipo7", documento_pdf : "pdf"},
    { id_cliente: "8", tipo_documento : "tipo8", documento_pdf : "pdf"},
    { id_cliente: "9", tipo_documento : "tipo9", documento_pdf : "pdf"},
    { id_cliente: "10", tipo_documento : "tipo10", documento_pdf : "pdf"},
];

try {
    connection.query("DELETE FROM documento", (error, results) => {
        if(error)
            throw error;
        console.log("documentos eliminados");
    });
    documentos.map(documento => {
        connection.query("INSERT INTO documento(id_cliente, tipo_documento, documento_pdf, created_by) VALUES (?,?,?,?) ",
            [documento.id_cliente, documento.tipo_documento, documento.documento_pdf, 0],
            (error, results) => {
                if(error)
                    throw error;
                console.log("documento añadido correctamente");
            });
    });
} catch (err) {
    console.log(err)
}