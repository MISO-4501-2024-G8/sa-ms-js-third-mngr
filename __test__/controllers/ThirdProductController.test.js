const express = require("express");
const supertest = require("supertest");
const { constants } = require('http2');
const jwt = require('jsonwebtoken');
jest.mock("jsonwebtoken", () => ({
    sign: jest.fn(() => "mocked-token")
}));
const Database = require("../../src/database/data");
const thirdProductController = require("../../src/controllers/ThirdProductController");
const { v4: uuidv4 } = require('uuid');
const exp = require("constants");

jest.mock('../../src/database/data', () => {
    const SequelizeMock = require("sequelize-mock");
    const Models = require('../../src/database/models');
    const DBThirdModels = require('../../src/database/dbthirdModels');
    class DatabaseMock {
        constructor(DBName) {
            this.sequelize = new SequelizeMock('database', 'username', 'password', {
                dialect: 'sqlite',
                storage: ':memory:',
            });
            if (DBName === 'db_user') {
                this.models = new Models(this.sequelize);
            } else if (DBName === 'db_third') {
                this.models = new DBThirdModels(this.sequelize);
            }
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

describe("ThirdProductController", () => {
    let app;
    const idUser = uuidv4().split('-')[0];
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use("/third", thirdProductController);
    });

    it("should handle error Third Product", async () => {
        process.env.NODE_ENVIRONMENT = "test";
        const response = await supertest(app)
            .post("/third/third_product")
            .send(undefined);
        expect(response.status).toBe(constants.HTTP_STATUS_BAD_REQUEST);
    });

    it("should create a Normal Third Product", async () => {
        process.env.NODE_ENVIRONMENT = "test";
        const tproductData = {
            "id_third_user": "eaf96b53",
            "typeProduct": "delivery-devices",
            "name": "Dispositivos Mario 2",
            "description": "Ofrecemos alquiler de dispositivos para recuperacion en entrenamiento",
            "value": 5,
            "representative_phone": "3212453456"
        };
        const response = await supertest(app)
            .post("/third/third_product")
            .send(tproductData);
        expect(response.status).toBe(constants.HTTP_STATUS_CREATED);
    });

    it("should create a Medical Third Product", async () => {
        process.env.NODE_ENVIRONMENT = "test";
        const tproductData = {
            "id_third_user": "eaf96b53",
            "typeProduct": "medical",
            "name": "Doctor Xavier 2",
            "description": "Servicio de atencion y calidad medicos deportologos",
            "value": 50,
            "representative_phone": "3212232345",
            "address": "Calle 123 #23-34",
            "availability": [
                {
                    "day": "lunes",
                    "time_start": 7,
                    "time_end": 17
                },
                {
                    "day": "martes",
                    "time_start": 7,
                    "time_end": 17
                }
            ]
        };
        const response = await supertest(app)
            .post("/third/third_product")
            .send(tproductData);
        expect(response.status).toBe(constants.HTTP_STATUS_CREATED);
    });

    it("should create a Trainer Third Product", async () => {
        process.env.NODE_ENVIRONMENT = "test";
        const tproductData = {
            "id_third_user": "eaf96b53",
            "typeProduct": "trainer",
            "name": "Entrenador XX 2",
            "description": "Ofrece servicios de entrenamiento personalizado y muy baratos",
            "value": 40,
            "representative_phone": "3223467890",
            "availability": [
                {
                    "day": "martes",
                    "time_start": 11,
                    "time_end": 15
                },
                {
                    "day": "viernes",
                    "time_start": 11,
                    "time_end": 15
                }
            ]
        };
        const response = await supertest(app)
            .post("/third/third_product")
            .send(tproductData);
        expect(response.status).toBe(constants.HTTP_STATUS_CREATED);
    });

    it("should create a Trainer Third Product", async () => {
        process.env.NODE_ENVIRONMENT = "test";
        process.env.post_thirdu = "true";
        const tproductData = {
            "id_third_user": "eaf96b53",
            "typeProduct": "trainer",
            "name": "Entrenador XX 2",
            "description": "Ofrece servicios de entrenamiento personalizado y muy baratos",
            "value": 40,
            "representative_phone": "3223467890",
            "availability": [
                {
                    "day": "martes",
                    "time_start": 11,
                    "time_end": 15
                },
                {
                    "day": "viernes",
                    "time_start": 11,
                    "time_end": 15
                }
            ]
        };
        const response = await supertest(app)
            .post("/third/third_product")
            .send(tproductData);
        expect(response.status).toBe(constants.HTTP_STATUS_NOT_FOUND);
    });

    it('should get third_catalog', async () => {
        process.env.NODE_ENVIRONMENT = "test";
        const response = await supertest(app)
            .get("/third/third_catalog")
        expect(response.status).toBe(constants.HTTP_STATUS_OK);
    });

    it('should get third_product', async () => {
        process.env.NODE_ENVIRONMENT = "test";
        const response = await supertest(app)
            .get("/third/third_product")
        expect(response.status).toBe(constants.HTTP_STATUS_OK);
    });

    it('should get third_product by id', async () => {
        process.env.NODE_ENVIRONMENT = "test";
        const response = await supertest(app)
            .get("/third/third_product/1")
        expect(response.status).toBe(constants.HTTP_STATUS_OK);
    });

    it('should hanlde error when get third_product by id - 1', async () => {
        process.env.NODE_ENVIRONMENT = "test";
        process.env.get_thirdu = 'true';
        const response = await supertest(app)
            .get("/third/third_product/1")
        expect(response.status).toBe(constants.HTTP_STATUS_NOT_FOUND);
    });

    it('should get third_product by id - 2', async () => {
        process.env.NODE_ENVIRONMENT = "test";
        process.env.get_thirdu = 'false';
        process.env.get_medicalt = 'true';
        const response = await supertest(app)
            .get("/third/third_product/1")
        expect(response.status).toBe(constants.HTTP_STATUS_OK);
    });

    it('should get third_product by id - 3', async () => {
        process.env.NODE_ENVIRONMENT = "test";
        process.env.get_thirdu = 'false';
        process.env.get_medicalt = 'false';
        process.env.get_trainert = 'false';
        const response = await supertest(app)
            .get("/third/third_product/1")
        expect(response.status).toBe(constants.HTTP_STATUS_OK);
    });

    it('should delete third_product by id', async () => {
        process.env.NODE_ENVIRONMENT = "test";
        const response = await supertest(app)
            .delete("/third/third_product/1")
        expect(response.status).toBe(constants.HTTP_STATUS_OK);
    });

    it('should delete third_product by id - 1', async () => {
        process.env.NODE_ENVIRONMENT = "test";
        process.env.third_p = "true";
        const response = await supertest(app)
            .delete("/third/third_product/1")
        expect(response.status).toBe(constants.HTTP_STATUS_NOT_FOUND);
    });

    it('should delete third_product by id - 2', async () => {
        process.env.NODE_ENVIRONMENT = "test";
        process.env.third_p = "false";
        process.env.medical_p = "true";
        const response = await supertest(app)
            .delete("/third/third_product/1")
        expect(response.status).toBe(constants.HTTP_STATUS_OK);
    });

    it('should delete third_product by id - 3', async () => {
        process.env.NODE_ENVIRONMENT = "test";
        process.env.third_p = "false";
        process.env.medical_p = "false";
        process.env.trainer_p = "true";
        const response = await supertest(app)
            .delete("/third/third_product/1")
        expect(response.status).toBe(constants.HTTP_STATUS_OK);
    });

    it('should post to customer_service', async () => {
        process.env.NODE_ENVIRONMENT = "test";
        const response = await supertest(app)
            .post("/third/customer_service")
            .send({
                "id_user":"e2f75148",
                "id_service": "d890e14f",
                "user_name": "Pepito",
                "user_address": "Calle 123 #24-45",
                "user_neighborhood": "Engativa",
                "user_phone": "3223443231",
                "value": 50,
                "service_date":"2024-04-19"
            })
        expect(response.status).toBe(constants.HTTP_STATUS_CREATED);
    });

    it('should handle error when post to customer_service - 1', async () => {
        process.env.NODE_ENVIRONMENT = "test";
        const response = await supertest(app)
            .post("/third/customer_service")
            .send(undefined)
        expect(response.status).toBe(constants.HTTP_STATUS_BAD_REQUEST);
    });

    it('should handle error when post to customer_service - 2', async () => {
        process.env.NODE_ENVIRONMENT = "test";
        process.env.user_u = "true";
        const response = await supertest(app)
            .post("/third/customer_service")
            .send({
                "id_user":"e2f75148",
                "id_service": "d890e14f",
                "user_name": "Pepito",
                "user_address": "Calle 123 #24-45",
                "user_neighborhood": "Engativa",
                "user_phone": "3223443231",
                "value": 50,
                "service_date":"2024-04-19"
            })
        expect(response.status).toBe(constants.HTTP_STATUS_NOT_FOUND);
    });

    it('should handle error when post to customer_service - 3', async () => {
        process.env.NODE_ENVIRONMENT = "test";
        process.env.user_u = "false";
        process.env.third_u = "true";
        const response = await supertest(app)
            .post("/third/customer_service")
            .send({
                "id_user":"e2f75148",
                "id_service": "d890e14f",
                "user_name": "Pepito",
                "user_address": "Calle 123 #24-45",
                "user_neighborhood": "Engativa",
                "user_phone": "3223443231",
                "value": 50,
                "service_date":"2024-04-19"
            })
        expect(response.status).toBe(constants.HTTP_STATUS_NOT_FOUND);
    });

    it('it should get customer_service by id', async () => {
        process.env.NODE_ENVIRONMENT = "test";
        const response = await supertest(app)
            .get("/third/customer_service/1")
        expect(response.status).toBe(constants.HTTP_STATUS_OK);
    });

    it('it should handle error when get customer_service by id', async () => {
        process.env.NODE_ENVIRONMENT = "test";
        process.env.userUndefined = "true";
        const response = await supertest(app)
            .get("/third/customer_service/1")
        expect(response.status).toBe(constants.HTTP_STATUS_NOT_FOUND);
    });

    it('it should delete customer_service by id', async () => {
        process.env.NODE_ENVIRONMENT = "test";
        const response = await supertest(app)
            .delete("/third/customer_service/1")
        expect(response.status).toBe(constants.HTTP_STATUS_OK);
    });

    it('it should handle error in customer_service by id', async () => {
        process.env.NODE_ENVIRONMENT = "test";
        process.env.CSUndefined = "true";
        const response = await supertest(app)
            .delete("/third/customer_service/1")
        expect(response.status).toBe(constants.HTTP_STATUS_NOT_FOUND);
    });

});