const express = require("express");
const { constants } = require('http2');
const jwt = require('jsonwebtoken');
const { encrypt } = require('../utils/encrypt_decrypt');
const { errorHandling } = require('../utils/errorHandling');
const { v4: uuidv4 } = require('uuid');
const Database = require("../database/data");

const registerThirdController = express.Router();


const db = new Database();
const user = db.models.defineUser();
const thirdUser = db.models.defineThirdUser();
const expirationTime = 600 * 2000;
const secret = 'MISO-4501-2024-G8';



registerThirdController.post("/third_user", async (req, res) => {
    try {
        if (req.body === undefined || req.body === null || Object.keys(req.body).length === 0) {
            const error = new Error("No se ha enviado el cuerpo de la petición");
            error.code = constants.HTTP_STATUS_BAD_REQUEST;
            throw error;
        }
        console.log('Petición de creación de usuario tercero:', JSON.stringify(req.body));
        const {
            email,
            password,
            doc_num,
            doc_type,
            name,
            phone,
            user_type,
            company_creation_date,
            company_address,
            contact_name} = req.body;

        const usuarioExistente = await user.findOne({ where: { email: email } });
        if (usuarioExistente && usuarioExistente.email === email && process.env.NODE_ENVIRONMENT !== "test") {
            const error = new Error("El usuario ya existe");
            error.code = constants.HTTP_STATUS_CONFLICT;
            throw error;
        }

        let userType = 0;
        // A: Administrator, S: Sport User, T: Third Party User
        if (user_type === 'T') {
            userType = 2;
        }

        const encryptPWD = encrypt(password, secret);
        console.log('Contraseña encriptada:', encryptPWD);
        const idUser = uuidv4().split('-')[0];
        const expiration_token = Date.now() + expirationTime;
        const token = jwt.sign({
            email,
            encryptPWD,
            exp: expiration_token
        }, process.env.TOKEN_SECRET)

        const nuevoUsuario = await user.create({
            id: idUser,
            email,
            password: encryptPWD,
            doc_num,
            doc_type,
            name,
            phone,
            user_type: userType,
            token,
            expiration_token
        });

        console.log('Nuevo usuario creado:', JSON.stringify(nuevoUsuario.toJSON()));

        const nuevoUsuarioThird = await thirdUser.create({
            id: idUser,
            company_creation_date,
            company_address,
            contact_name 
        });

        console.log('Nuevo usuario creado:', JSON.stringify(nuevoUsuarioThird.toJSON()));
        const expiration_dat_token = new Date(parseInt(expiration_token))
        console.log('expiration_token:', expiration_dat_token.toString());
        res.status(constants.HTTP_STATUS_OK).json({
            message: 'Usuario insertado correctamante',
            token: token,
            id: idUser,
            expirationToken: expiration_dat_token.toString(),
            code: constants.HTTP_STATUS_OK
        });
    } catch (error) {
        const {code, message} = errorHandling(error);
        res.status(code).json({ error: message, code: code});
    }
});

module.exports = registerThirdController;