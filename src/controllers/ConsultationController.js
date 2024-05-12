const express = require("express");
const { constants } = require('http2');
const jwt = require('jsonwebtoken');
const { encrypt } = require('../utils/encrypt_decrypt');
const { errorHandling } = require('../utils/errorHandling');
const { v4: uuidv4 } = require('uuid');
const Database = require("../database/data");

const consultationController = express.Router();

const dbThird = new Database("db_third");
const Consultation =  dbThird.models.defineConsultation();
const expirationTime = 600 * 2000;
const secret = 'MISO-4501-2024-G8';

const checkBody = async (req, res) => {
    if (req.body === undefined || req.body === null || Object.keys(req.body).length === 0) {
        const error = new Error("No se ha enviado el cuerpo de la petición");
        error.code = constants.HTTP_STATUS_BAD_REQUEST;
        throw error;
    }
}

consultationController.get("/consultations", async (req, res) => {
    try {
        const consultations = await Consultation.findAll();
        res.status(constants.HTTP_STATUS_OK).json({
            consultations,
            code: constants.HTTP_STATUS_OK
        });
    } catch (error) {
        const { code } = errorHandling(error, res);
        res.status(code).json({
            message: error,
            code: code
        });
    }
});

consultationController.get("/consultation/:id", async (req, res) => {
    try {
        const { id } = req.params;
        let consultation = await Consultation.findOne({ where: { id: id } });
        if(process.env.NODE_ENVIRONMENT === "consulta_no_existente") {
            consultation =  undefined;
        }
        if (!consultation) {
            const error = new Error("La consulta no existe");
            error.code = constants.HTTP_STATUS_NOT_FOUND;
            throw error;
        }
        res.status(constants.HTTP_STATUS_OK).json({
            consultation,
            code: constants.HTTP_STATUS_OK
        });
    } catch (error) {
        const { code } = errorHandling(error, res);
        res.status(code).json({
            message: error,
            code: code
        });
    }
});

consultationController.get("/consultations/user/:id", async (req, res) => {
    try {
        const { id } = req.params;
        let consultation = await Consultation.findAll({ where: { id_user: id } });
        if(process.env.NODE_ENVIRONMENT === "consulta_no_existente") {
            consultation =  undefined;
        }
        if (!consultation) {
            const error = new Error("El usuario no tiene asociadas consultas");
            error.code = constants.HTTP_STATUS_NOT_FOUND;
            throw error;
        }
        res.status(constants.HTTP_STATUS_OK).json({
            consultation,
            code: constants.HTTP_STATUS_OK
        });
    } catch (error) {
        const { code } = errorHandling(error, res);
        res.status(code).json({
            message: error,
            code: code
        });
    }
});

consultationController.post("/consultations", async (req, res) => {
    try {
        await checkBody(req, res);
        const {
            id_service_worker,
            id_user,
            consultation_type,
            consultation_date,
            link,
        } = req.body;

        const idConsultation = uuidv4().split('-')[0];
        const consultation = await Consultation.create({
            id: idConsultation,
            id_service_worker,
            id_user,
            consultation_type,
            consultation_date,
            link,
        });
        res.status(constants.HTTP_STATUS_CREATED).json({
            consultation,
            code: constants.HTTP_STATUS_CREATED
        });
        
    } catch (error) {
        const { code } = errorHandling(error, res);
        res.status(code).json({
            message: error,
            code: code
        });
    }
});

consultationController.put("/consultations/:id", async (req, res) => {
    try {
        await checkBody(req, res);
        const {
            id_service_worker,
            id_user,
            consultation_type,
            consultation_date,
            link,
        } = req.body;
        const { id } = req.params;

        let consultation = await Consultation.findOne({ where: { id: id } });
        if(process.env.NODE_ENVIRONMENT === "consulta_no_existente") {
            consultation =  undefined;
        }
        if (!consultation) {
            const error = new Error("La consulta no fue encontrada");
            error.code = constants.HTTP_STATUS_NOT_FOUND;
            throw error;
        }
        consultation.id_service_worker = id_service_worker
        consultation.id_user = id_user
        consultation.consultation_type = consultation_type
        consultation.consultation_date = consultation_date
        consultation.link = link
        consultation.save()
        res.status(constants.HTTP_STATUS_OK).json({
            consultation,
            code: constants.HTTP_STATUS_OK
        });
    } catch (error) {
        const { code } = errorHandling(error, res);
        res.status(code).json({
            message: error,
            code: code
        });
    }
});

module.exports = consultationController;