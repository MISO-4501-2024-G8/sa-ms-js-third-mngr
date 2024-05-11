const express = require("express");
const supertest = require("supertest");
const { constants } = require('http2');
const jwt = require('jsonwebtoken');
jest.mock("jsonwebtoken", () => ({
    sign: jest.fn(() => "mocked-token")
}));
const Database = require("../../src/database/data");
const consultationController = require("../../src/controllers/ConsultationController");
const { v4: uuidv4 } = require('uuid');
const exp = require("constants");

jest.mock('../../src/database/data', () => {
    const SequelizeMock = require("sequelize-mock");
    const Models = require('../../src/database/models');
    const DBThirdModels = require('../../src/database/dbthirdModels');
    class DatabaseMock {
        constructor() {
            this.sequelize = new SequelizeMock('database', 'username', 'password', {
                dialect: 'sqlite',
                storage: ':memory:',
            });
                this.models = new DBThirdModels(this.sequelize);   
        }

        async connect() {
            try {
                await this.sequelize.authenticate();
                console.log('Conexión a la base de datos establecida correctamente.');
            } catch (error) {
                console.error('Error al conectar a la base de datos:', error);
            }
        }

        async defineModel(modelName, fields) {
            return this.sequelize.define(modelName, fields);
        }

        async syncModels() {
            try {
                await this.sequelize.sync();
                console.log('Modelos sincronizados correctamente.');
            } catch (error) {
                console.error('Error al sincronizar modelos:', error);
            }
        }
    }
    return DatabaseMock;
});

describe("ConsultationController", () => {
    let app;
    const idUser = uuidv4().split('-')[0];
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use("/consultation", consultationController);
    });

    it("should handle error consultation", async () => {
        process.env.NODE_ENVIRONMENT = "test";
        const response = await supertest(app)
            .post("/consultation/consultations")
            .send(undefined);
        expect(response.status).toBe(constants.HTTP_STATUS_BAD_REQUEST);
    });

    it("should get consultations", async () => {
        process.env.NODE_ENVIRONMENT = "test";
        const response = await supertest(app)
            .get("/consultation/consultations")
        expect(response.status).toBe(constants.HTTP_STATUS_OK);
    });

    it("should create a consultation", async () => {
        process.env.NODE_ENVIRONMENT = "test";
        const tproductData = {
            "id_service_worker": "asert15sd45",
            "id_user": "a2133bb5",
            "consultation_type": "Virtual",
            "consultation_date": "2024-05-28 14:30:00",
            "link": "http://linkreu.edu"
        };
        const response = await supertest(app)
            .post("/consultation/consultations")
            .send(tproductData);
        expect(response.status).toBe(constants.HTTP_STATUS_CREATED);
    });

    it("should update a consultation", async () => {
        process.env.NODE_ENVIRONMENT = "test";
        const tproductData = {
            "id_service_worker": "asert15sd45",
            "id_user": "a2133bb5",
            "consultation_type": "Virtual",
            "consultation_date": "2024-05-28 14:30:00",
            "link": "http://linkreu.edu"
        };
        const response = await supertest(app)
            .put("/consultation/consultations/1")
            .send(tproductData);
        expect(response.status).toBe(constants.HTTP_STATUS_OK);
    });

    it("should get one consultation", async () => {
        process.env.NODE_ENVIRONMENT = "test";
        const response = await supertest(app)
            .get("/consultation/consultation/1")
        expect(response.status).toBe(constants.HTTP_STATUS_OK);
    });

    it("should get a user consultations", async () => {
        process.env.NODE_ENVIRONMENT = "test";
        const response = await supertest(app)
            .get("/consultation/consultations/user/1")
        expect(response.status).toBe(constants.HTTP_STATUS_OK);
    });

    it("should throw error for an invalid consultation", async () => {
        process.env.NODE_ENVIRONMENT = "consulta_no_existente";
        const response = await supertest(app)
            .get("/consultation/consultation/1")
        expect(response.status).toBe(constants.HTTP_STATUS_NOT_FOUND);
    });

    it("should throw error for an invalid user consultations", async () => {
        process.env.NODE_ENVIRONMENT = "consulta_no_existente";
        const response = await supertest(app)
            .get("/consultation/consultations/user/33333")
        expect(response.status).toBe(constants.HTTP_STATUS_NOT_FOUND);
    });

    it("should handle error for an invalid consultation update", async () => {
        process.env.NODE_ENVIRONMENT = "consulta_no_existente";
        const tproductData = {
            "id_service_worker": "asert15sd45",
            "id_user": "a2133bb5",
            "consultation_type": "Virtual",
            "consultation_date": "2024-05-28 14:30:00",
            "link": "http://linkreu.edu"
        };
        const response = await supertest(app)
            .put("/consultation/consultations/1")
            .send(tproductData);
        expect(response.status).toBe(constants.HTTP_STATUS_NOT_FOUND);
    });


});