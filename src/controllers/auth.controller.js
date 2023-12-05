const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {connection} = require("../configs/db");
const {serialize} = require("cookie");

const loginAuth = async (req, res) => {
    try {
        const {email, password} = req.body;
        connection.query("SELECT * FROM usuario WHERE email = ?",
            [email], async (error, results) => {
                if (error)
                    throw error;
                console.log(results);
                if (results.length === 0) {
                    return res.status(200).json({
                        message: "email o contraseña incorrecta"
                    });
                }
                let passwordCorrecta = false;
                const contrasena = results[0].password;
                if (bcrypt.compareSync(password, contrasena))
                    passwordCorrecta = true;

                if (!passwordCorrecta) {
                    return res.status(200).json({
                        message: "email o contraseña incorrecta"
                    });
                }
                const payload = {
                    usuario: {
                        _id: results[0].id_usuario
                    }
                }

                const token = jwt.sign(payload, process.env.SECRET, {expiresIn: '1h'});
                const serialized = serialize('aToken', token, {
                    sameSite: 'none',
                    maxAge: 60 * 60 * 1000,
                    path: '/',
                })
                res.setHeader("Set-Cookie", serialized);
                res.cookie(serialized);
                res.send();
            })




    } catch (err) {
        return res.status(500).json({
            message: "error al intentar loguearse",
            error: err.message
        })
    }
}

module.exports = {
    loginAuth
}