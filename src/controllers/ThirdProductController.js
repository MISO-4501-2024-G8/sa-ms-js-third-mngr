const express = require("express");
const { constants } = require('http2');
const jwt = require('jsonwebtoken');
const { encrypt } = require('../utils/encrypt_decrypt');
const { errorHandling } = require('../utils/errorHandling');
const { v4: uuidv4 } = require('uuid');
const Database = require("../database/data");

const thirdProductController = express.Router();

const dbUser = new Database("db_user");
const dbThird = new Database("db_third");
// db_user
const User = dbUser.models.defineUser();
const ThirdUser = dbUser.models.defineThirdUser();
// db_third
const ThirdProduct = dbThird.models.defineThirdProduct();
const Doctor = dbThird.models.defineDoctor();
const Trainer = dbThird.models.defineTrainer();
const CustomerService = dbThird.models.defineCustomerService();
const Availability = dbThird.models.defineAvailability();

const expirationTime = 600 * 2000;
const secret = 'MISO-4501-2024-G8';

thirdProductController.get("/third_catalog", async (req, res) => {
    try {
        const users = await User.findAll({ where: { user_type: 2 } });
        const thirdUsers = await Promise.all(await users.map(async (user) => {
            const thirdUser = await ThirdUser.findOne({ where: { id: user.id } });
            return {
                id: user.id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                company_address: thirdUser.company_address,
                company_creation_date: thirdUser.company_creation_date,
                contact_name: thirdUser.contact_name,
                company_description: thirdUser.company_description,
                company_status: thirdUser.company_status
            };
        }));
        res.status(constants.HTTP_STATUS_OK).json(thirdUsers);
    } catch (error) {
        const { code, message } = errorHandling(error, res);
        res.status(code).json({ message });
    }
});

thirdProductController.get("/third_product", async (req, res) => {
    try {
        const thirdProducts = await ThirdProduct.findAll();
        res.status(constants.HTTP_STATUS_OK).json(thirdProducts);
    } catch (error) {
        const { code, message } = errorHandling(error, res);
        res.status(code).json({ message });
    }
});

thirdProductController.get("/third_product/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const thirdUser = await ThirdUser.findOne({ where: { id: id } });
        if (!thirdUser) {
            const error = new Error("El tercero no existe");
            error.code = constants.HTTP_STATUS_NOT_FOUND;
            throw error;
        }
        const thirdProduct = await ThirdProduct.findAll({ where: { id_third_user: id } });
        const allProducts = await Promise.all(await thirdProduct.map(async (prod) => {
            const product = prod.toJSON();
            console.log('Product:', JSON.stringify(product));
            const productType = product.typeProduct;
            if (product.typeProduct === 'medical') {
                const doctor = await Doctor.findOne({ where: { id_third_product: product.id } });
                const availability = await Availability.findAll({ where: { id_service_worker: doctor.id } });
                return {
                    productType,
                    thirdProduct: product,
                    doctor: doctor,
                    availability: availability
                };
            } else if (product.typeProduct === 'trainer') {
                const trainer = await Trainer.findOne({ where: { id_third_product: product.id } });
                const availability = await Availability.findAll({ where: { id_service_worker: trainer.id } });
                return {
                    productType,
                    thirdProduct: product,
                    trainer: trainer,
                    availability: availability
                };
            } else {
                return {
                    productType,
                    thirdProduct: product
                };
            }
        }));
        allProducts.sort((a, b) => b.productType.localeCompare(a.productType));
        res.status(constants.HTTP_STATUS_OK).json(allProducts);
    } catch (error) {
        const { code, message } = errorHandling(error, res);
        res.status(code).json({ message });
    }
});

thirdProductController.post("/third_product", async (req, res) => {
    try {
        if (req.body === undefined || req.body === null || Object.keys(req.body).length === 0) {
            const error = new Error("No se ha enviado el cuerpo de la petición");
            error.code = constants.HTTP_STATUS_BAD_REQUEST;
            throw error;
        }
        const {
            id_third_user,
            name,
            description,
            value,
            typeProduct,
            representative_phone
        } = req.body;
        const thirdUserExist = await ThirdUser.findOne({ where: { id: id_third_user } });
        if (!thirdUserExist) {
            const error = new Error("El usuario tercero no existe");
            error.code = constants.HTTP_STATUS_NOT_FOUND;
            throw error;
        }
        const idThirdProduct = uuidv4().split('-')[0];
        const thirdProduct = await ThirdProduct.create({
            id: idThirdProduct,
            id_third_user,
            name,
            description,
            value,
            typeProduct,
            representative_phone
        });
        if (!['medical', 'trainer'].includes(typeProduct)) {
            res.status(constants.HTTP_STATUS_CREATED).json(thirdProduct);
            return;
        }
        if (typeProduct === 'medical') {
            const {
                address,
                availability
            } = req.body;
            const idDoctor = uuidv4().split('-')[0];
            const doctor = await Doctor.create({
                id: idDoctor,
                id_third_product: idThirdProduct,
                address: address,
                phone: representative_phone
            });
            const avdoc = [];
            for (const availability_t of availability) {
                const idAvailability = uuidv4().split('-')[0];
                const doc_av = await Availability.create({
                    id: idAvailability,
                    id_service_worker: idDoctor,
                    day: availability_t.day,
                    time_start: availability_t.time_start,
                    time_end: availability_t.time_end
                });
                avdoc.push(doc_av);
            }
            console.log('Doctor:', JSON.stringify(doctor.toJSON()));
            const thirdMedical = {
                thirdProduct: thirdProduct,
                doctor: doctor,
                availability: avdoc

            }
            res.status(constants.HTTP_STATUS_CREATED).json(thirdMedical);
        } else if (typeProduct === 'trainer') {
            const {
                availability
            } = req.body;
            const idTrainer = uuidv4().split('-')[0];
            const trainer = await Trainer.create({
                id: idTrainer,
                id_third_product: idThirdProduct,
                phone: representative_phone
            });
            const avtrainer = [];
            for (const availability_t of availability) {
                const idAvailability = uuidv4().split('-')[0];
                const trainer_av = await Availability.create({
                    id: idAvailability,
                    id_service_worker: idTrainer,
                    day: availability_t.day,
                    time_start: availability_t.time_start,
                    time_end: availability_t.time_end
                });
                avtrainer.push(trainer_av);
            }
            console.log('Trainer:', JSON.stringify(trainer.toJSON()));
            const thirdTrainer = {
                thirdProduct: thirdProduct,
                trainer: trainer,
                availability: avtrainer
            }
            res.status(constants.HTTP_STATUS_CREATED).json(thirdTrainer);
        }
    } catch (error) {
        const { code, message } = errorHandling(error, res);
        res.status(code).json({ message });
    }
});

thirdProductController.delete("/third_product/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const thirdProduct = await ThirdProduct.findOne({ where: { id: id } });
        if (!thirdProduct) {
            const error = new Error("El producto tercero no existe");
            error.code = constants.HTTP_STATUS_NOT_FOUND;
            throw error;
        }
        await ThirdProduct.destroy({ where: { id: id } });
        if (thirdProduct.typeProduct === 'medical') {
            const doctor = await Doctor.findOne({ where: { id_third_product: id } });
            if (doctor) {
                await Doctor.destroy({ where: { id: doctor.id } });
                const availability = await Availability.findAll({ where: { id_service_worker: doctor.id } });
                await Promise.all(await availability.map(async (avail) => {
                    await Availability.destroy({ where: { id: avail.id } });
                }));
            }
        }
        if (thirdProduct.typeProduct === 'trainer') {
            const trainer = await Trainer.findOne({ where: { id_third_product: id } });
            if (trainer) {
                await Trainer.destroy({ where: { id: trainer.id } });
                const availability = await Availability.findAll({ where: { id_service_worker: trainer.id } });
                await Promise.all(await availability.map(async (avail) => {
                    await Availability.destroy({ where: { id: avail.id } });
                }));
            }
        }
        res.status(constants.HTTP_STATUS_OK).json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        const { code, message } = errorHandling(error, res);
        res.status(code).json({ message });
    }
});

thirdProductController.post("/customer_service", async (req, res) => {
    try {
        if (req.body === undefined || req.body === null || Object.keys(req.body).length === 0) {
            const error = new Error("No se ha enviado el cuerpo de la petición");
            error.code = constants.HTTP_STATUS_BAD_REQUEST;
            throw error;
        }
        const {
            id_user,
            id_service,
            user_name,
            user_address,
            user_neighborhood,
            user_phone,
            value,
            service_date
        } = req.body;
        const userExist = await User.findOne({ where: { id: id_user } });
        if (!userExist) {
            const error = new Error("El usuario no existe");
            error.code = constants.HTTP_STATUS_NOT_FOUND;
            throw error;
        }
        const thirdProductExist = await ThirdProduct.findOne({ where: { id: id_service } });
        if (!thirdProductExist) {
            const error = new Error("El producto tercero no existe");
            error.code = constants.HTTP_STATUS_NOT_FOUND;
            throw error;
        }
        const idCS = uuidv4().split('-')[0];
        const customerService = await CustomerService.create({
            id: idCS,
            id_user,
            id_service,
            user_name,
            user_address,
            user_neighborhood,
            user_phone,
            value,
            service_date
        });
        
        res.status(constants.HTTP_STATUS_CREATED).json(customerService);
    } catch (error) {
        const { code, message } = errorHandling(error, res);
        res.status(code).json({ message });
    }
});

thirdProductController.get("/customer_service/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ where: { id: id } });
        if (!user) {
            const error = new Error("El usuario no existe");
            error.code = constants.HTTP_STATUS_NOT_FOUND;
            throw error;
        }
        const customerService = await CustomerService.findAll({ where: { id_user: id } });
        const customer_services = await Promise.all(await customerService.map(async (cs) => {
            const service = await ThirdProduct.findOne({ where: { id: cs.id_service } });
            return {
                id: cs.id,
                user_id: cs.id_user,
                service_id: cs.id_service,
                id_third_user: service.id_third_user,
                product_name: service.name,
                product_description: service.description,
                product_type: service.typeProduct,
                representative_phone: service.representative_phone,
                service_user_name: cs.user_name,
                service_user_address: cs.user_address,
                service_user_neighborhood: cs.user_neighborhood,
                service_user_phone: cs.user_phone,
                service_value: cs.value,
                service_date: cs.service_date
            };
        }));
        
        res.status(constants.HTTP_STATUS_OK).json(customer_services);
    } catch (error) {
        const { code, message } = errorHandling(error, res);
        res.status(code).json({ message });
    }
});

thirdProductController.delete("/customer_service/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const customerService = await CustomerService.findOne({ where: { id: id } });
        if (!customerService) {
            const error = new Error("El servicio al cliente no existe");
            error.code = constants.HTTP_STATUS_NOT_FOUND;
            throw error;
        }
        await CustomerService.destroy({ where: { id: id } });
        res.status(constants.HTTP_STATUS_OK).json({ message: "Servicio al cliente eliminado correctamente" });
    } catch (error) {
        const { code, message } = errorHandling(error, res);
        res.status(code).json({ message });
    }
});



module.exports = thirdProductController;