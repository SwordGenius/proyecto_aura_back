const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

const usuariosRouter = require('./src/routes/usuarios.route');
app.use(cookieParser());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Credentials", "true")
    next();
});

app.use('/usuarios', usuariosRouter);
app.use('/auth', require('./src/routes/auth.route'));
app.listen(process.env.PORT||3300,() => {
    console.log("Servidor corriendo en el puerto 3300");
});

module.exports = app;