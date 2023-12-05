const {connection} = require('../configs/db');

const clientes = [
    { nombre: "nombre1", apellido_P : "apellido_P1", apellido_M : "apellido_P1", edad: 1, id_usuario: 1 },
    { nombre: "nombre2", apellido_P : "apellido_P2", apellido_M : "apellido_P2", edad: 2, id_usuario: 2 },
    { nombre: "nombre3", apellido_P : "apellido_P3", apellido_M : "apellido_P3", edad: 3, id_usuario: 3 },
    { nombre: "nombre4", apellido_P : "apellido_P4", apellido_M : "apellido_P4", edad: 4, id_usuario: 4 },
    { nombre: "nombre5", apellido_P : "apellido_P5", apellido_M : "apellido_P5", edad: 5, id_usuario: 5 },
    { nombre: "nombre6", apellido_P : "apellido_P6", apellido_M : "apellido_P6", edad: 6, id_usuario: 6 },
    { nombre: "nombre7", apellido_P : "apellido_P7", apellido_M : "apellido_P7", edad: 7, id_usuario: 7 },
    { nombre: "nombre8", apellido_P : "apellido_P8", apellido_M : "apellido_P8", edad: 8, id_usuario: 8 },
    { nombre: "nombre9", apellido_P : "apellido_P9", apellido_M : "apellido_P9", edad: 9, id_usuario: 9 },
    { nombre: "nombre10", apellido_P : "apellido_P10", apellido_M : "apellido_P10", edad: 10, id_usuario: 10},
];

try {
    connection.query("DELETE FROM cliente", (error, results) => {
        if(error)
            throw error;
        console.log("clientes eliminados");
    });
    clientes.map(cliente => {
        connection.query("INSERT INTO cliente(nombre, apellido_paterno, apellido_materno, edad, created_by, id_usuario) VALUES (?,?,?,?,?,?) ",
            [cliente.nombre, cliente.apellido_P, cliente.apellido_M, cliente.edad, 0, cliente.id_usuario],
            (error, results) => {
                if(error)
                    throw error;
                console.log("cliente añadido correctamente");
            });
    });
} catch (err) {
    console.log(err)
}