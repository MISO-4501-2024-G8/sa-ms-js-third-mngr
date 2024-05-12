const express = require("express");
const { constants } = require('http2');
const jwt = require('jsonwebtoken');
const { encrypt } = require('../utils/encrypt_decrypt');
const { errorHandling } = require('../utils/errorHandling');
const { v4: uuidv4 } = require('uuid');
const Database = require("../database/data");

const trainerDoctorController = express.Router();

const dbUser = new Database("db_user");
const dbThird = new Database("db_third");
const Doctor = dbThird.models.defineDoctor();
const Trainer = dbThird.models.defineTrainer();

const expirationTime = 600 * 2000;
const secret = 'MISO-4501-2024-G8';

/*const checkBody = async (req, res) => {
    if (req.body === undefined || req.body === null || Object.keys(req.body).length === 0) {
        const error = new Error("No se ha enviado el cuerpo de la petición");
        error.code = constants.HTTP_STATUS_BAD_REQUEST;
        throw error;
    }
}*/

trainerDoctorController.get("/doctors", async (req, res) => {
    try {
        const doctors = await Doctor.findAll();
        res.status(constants.HTTP_STATUS_OK).json({
            doctors,
            code: constants.HTTP_STATUS_OK
        });
    } catch (error) {
        const { code, message } = errorHandling(error, res);
        res.status(code).json({
            message: error,
            code: code
        });
    }
});

trainerDoctorController.get("/doctor/:id", async (req, res) => {
    try {
        const { id } = req.params;
        let doctor = await Doctor.findOne({ where: { id: id } });
        if(process.env.NODE_ENVIRONMENT === "consulta_no_existente") {
            consultation =  undefined;
        }
        if (!doctor) {
            const error = new Error("El doctor no existe");
            error.code = constants.HTTP_STATUS_NOT_FOUND;
            throw error;
        }
        res.status(constants.HTTP_STATUS_OK).json({
            doctor,
            code: constants.HTTP_STATUS_OK
        });
    } catch (error) {
        const { code, message } = errorHandling(error, res);
        res.status(code).json({
            message: error,
            code: code
        });
    }
});

trainerDoctorController.get("/trainers", async (req, res) => {
    try {
        const trainers = await Trainer.findAll();
        res.status(constants.HTTP_STATUS_OK).json({
            trainers,
            code: constants.HTTP_STATUS_OK
        });
    } catch (error) {
        const { code, message } = errorHandling(error, res);
        res.status(code).json({
            message: error,
            code: code
        });
    }
});

trainerDoctorController.get("/trainer/:id", async (req, res) => {
    try {
        const { id } = req.params;
        let trainer = await Trainer.findOne({ where: { id: id } });
        if(process.env.NODE_ENVIRONMENT === "consulta_no_existente") {
            consultation =  undefined;
        }
        if (!trainer) {
            const error = new Error("El entrenador no existe");
            error.code = constants.HTTP_STATUS_NOT_FOUND;
            throw error;
        }
        res.status(constants.HTTP_STATUS_OK).json({
            trainer,
            code: constants.HTTP_STATUS_OK
        });
    } catch (error) {
        const { code, message } = errorHandling(error, res);
        res.status(code).json({
            message: error,
            code: code
        });
    }
});

module.exports = trainerDoctorController;