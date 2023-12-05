const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const pusher = require('./src/configs/pusher.config')
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use(cors(
    {
        origin: ['http://localhost:3000'],
        credentials: true,
    }
))



const usuariosRouter = require('./src/routes/usuarios.route');
app.use(cookieParser());
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header("Access-Control-Allow-Credentials", "true")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/usuarios', usuariosRouter);
app.use('/clientes', require('./src/routes/clientes.route'));
app.use('/documentos', require('./src/routes/documentos.route'));
app.use('/historial', require('./src/routes/historial.route'));
app.use('/citas', require('./src/routes/cita.route'));
app.use('/auth', require('./src/routes/auth.route'));
app.post('/message', async (req, res) => {
    await pusher.trigger('clientes', 'agregar', {
        message: req.body.message,
        username: req.body.username
    });

    res.status(200).json([]);
})


app.listen(process.env.PORT||3300,() => {
    console.log("Servidor corriendo en el puerto 3300");
});

module.exports = app