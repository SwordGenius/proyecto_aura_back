const {connection} = require('../configs/db');

const historiales = [
    { id_cliente: 1, motivo : "motivo1", diagnostico: "diagnostico1"},
    { id_cliente: 2, motivo : "motivo2", diagnostico: "diagnostico2"},
    { id_cliente: 3, motivo : "motivo3", diagnostico: "diagnostico3"},
    { id_cliente: 4, motivo : "motivo4", diagnostico: "diagnostico4"},
    { id_cliente: 5, motivo : "motivo5", diagnostico: "diagnostico5"},
    { id_cliente: 6, motivo : "motivo6", diagnostico: "diagnostico6"},
    { id_cliente: 7, motivo : "motivo7", diagnostico: "diagnostico7"},
    { id_cliente: 8, motivo : "motivo8", diagnostico: "diagnostico8"},
    { id_cliente: 9, motivo : "motivo9", diagnostico: "diagnostico9"},
    { id_cliente: 10, motivo : "motivo10", diagnostico: "diagnostico10"},
];

try {
    connection.query("DELETE FROM historial", (error, results) => {
        if(error)
            throw error;
        console.log("historiales eliminados");
    });
    historiales.map(historial => {
        connection.query("INSERT INTO historial(id_cliente, motivo, diagnostico, created_by) VALUES (?,?,?,?) ",
            [historial.id_cliente, historial.motivo, historial.diagnostico, 0],
            (error, results) => {
                if(error)
                    throw error;
                console.log("historial añadido correctamente");
            });
    });
} catch (err) {
    console.log(err)
}