const {connection} = require('../configs/db');

const clientes = [
    { nombre: "nombre1", apellido_P : "apellido_P1", apellido_M : "apellido_P1", proposito: "email1@gmail.com", edad: 1 },
    { nombre: "nombre2", apellido_P : "apellido_P2", apellido_M : "apellido_P2", proposito: "email2@gmail.com", edad: 2 },
    { nombre: "nombre3", apellido_P : "apellido_P3", apellido_M : "apellido_P3", proposito: "email3@gmail.com", edad: 3 },
    { nombre: "nombre4", apellido_P : "apellido_P4", apellido_M : "apellido_P4", proposito: "email4@gmail.com", edad: 4 },
    { nombre: "nombre5", apellido_P : "apellido_P5", apellido_M : "apellido_P5", proposito: "email5@gmail.com", edad: 5 },
    { nombre: "nombre6", apellido_P : "apellido_P6", apellido_M : "apellido_P6", proposito: "email6@gmail.com", edad: 6 },
    { nombre: "nombre7", apellido_P : "apellido_P7", apellido_M : "apellido_P7", proposito: "email7@gmail.com", edad: 7 },
    { nombre: "nombre8", apellido_P : "apellido_P8", apellido_M : "apellido_P8", proposito: "email8@gmail.com", edad: 8 },
    { nombre: "nombre9", apellido_P : "apellido_P9", apellido_M : "apellido_P9", proposito: "email9@gmail.com", edad: 9 },
    { nombre: "nombre10", apellido_P : "apellido_P10", apellido_M : "apellido_P10", proposito: "email10@gmail.com", edad: 10},
];

try {
    connection.query("DELETE FROM cliente", (error, results) => {
        if(error)
            throw error;
        console.log("clientes eliminados");
    });
    clientes.map(cliente => {
        connection.query("INSERT INTO cliente(nombre, apellido_paterno, apellido_materno, proposito, edad, deleted, created_at) VALUES (?,?,?,?,?,?,?) ",
            [cliente.nombre, cliente.apellido_P, cliente.apellido_M, cliente.proposito, cliente.edad, false, new Date()],
            (error, results) => {
                if(error)
                    throw error;
                console.log("cliente añadido correctamente");
            });
    });
} catch (err) {
    console.log(err)
}