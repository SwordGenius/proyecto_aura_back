const {connection} = require('../configs/db');

const citas = [
    {id_cliente: "1", id_usuario: "1", motivo: "motivo1", fecha_cita: "2021-01-01"},
    {id_cliente: "2", id_usuario: "2", motivo: "motivo2", fecha_cita: "2021-01-02"},
    {id_cliente: "3", id_usuario: "3", motivo: "motivo3", fecha_cita: "2021-01-03"},
    {id_cliente: "4", id_usuario: "4", motivo: "motivo4", fecha_cita: "2021-01-04"},
    {id_cliente: "5", id_usuario: "5", motivo: "motivo5", fecha_cita: "2021-01-05"},
    {id_cliente: "6", id_usuario: "6", motivo: "motivo6", fecha_cita: "2021-01-06"},
    {id_cliente: "7", id_usuario: "7", motivo: "motivo7", fecha_cita: "2021-01-07"},
    {id_cliente: "8", id_usuario: "8", motivo: "motivo8", fecha_cita: "2021-01-08"},
    {id_cliente: "9", id_usuario: "9", motivo: "motivo9", fecha_cita: "2021-01-09"},
    {id_cliente: "10", id_usuario: "10", motivo: "motivo10", fecha_cita: "2021-01-10"},
];

try {
    connection.query("DELETE FROM cita", (error, results) => {
        if(error)
            throw error;
        console.log("citas eliminadas");
    });
    citas.map(cita => {
        connection.query("INSERT INTO cita(id_cliente, id_usuario, motivo, fecha_cita, created_by) VALUES (?,?,?,?,?) ",
            [cita.id_cliente, cita.id_usuario, cita.motivo, cita.fecha_cita, 0],
            (error, results) => {
                if(error)
                    throw error;
                console.log("cita añadida correctamente");
            });
    });
} catch (err) {
    console.log(err)
}