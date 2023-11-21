const {connection} = require('../configs/db');

const documentos = [
    { id_cliente: "nombre1", tipo_documento : "apellido_P1", documento_pdf : "apellido_P1"},
    { id_cliente: "nombre2", tipo_documento : "apellido_P2", documento_pdf : "apellido_P2"},
    { id_cliente: "nombre3", tipo_documento : "apellido_P3", documento_pdf : "apellido_P3"},
    { id_cliente: "nombre4", tipo_documento : "apellido_P4", documento_pdf : "apellido_P4"},
    { id_cliente: "nombre5", tipo_documento : "apellido_P5", documento_pdf : "apellido_P5"},
    { id_cliente: "nombre6", tipo_documento : "apellido_P6", documento_pdf : "apellido_P6"},
    { id_cliente: "nombre7", tipo_documento : "apellido_P7", documento_pdf : "apellido_P7"},
    { id_cliente: "nombre8", tipo_documento : "apellido_P8", documento_pdf : "apellido_P8"},
    { id_cliente: "nombre9", tipo_documento : "apellido_P9", documento_pdf : "apellido_P9"},
    { id_cliente: "nombre10", tipo_documento : "apellido_P10", documento_pdf : "apellido_P10"},
];

try {
    connection.query("DELETE FROM documento", (error, results) => {
        if(error)
            throw error;
        console.log("documentos eliminados");
    });
    documentos.map(documento => {
        connection.query("INSERT INTO documento(id_cliente, tipo_documento, documento_pdf, deleted, created_at) VALUES (?,?,?,?,?) ",
            [documento.id_cliente, documento.tipo_documento, documento.documento_pdf, false, new Date()],
            (error, results) => {
                if(error)
                    throw error;
                console.log("documento añadido correctamente");
            });
    });
} catch (err) {
    console.log(err)
}