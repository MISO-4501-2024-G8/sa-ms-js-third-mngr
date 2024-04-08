// database.js

const { Sequelize } = require('sequelize');
const Models = require('./models');

class Database {
    constructor() {
        const DBData = {
            database: process.env.DB_DATABASE || "db_user" ,
            username: process.env.DB_USER || "admin",
            password: process.env.DB_PASSWORD || "123456789" ,
            host: process.env.DB_HOST || "databasesportapp.cvweuasge1pc.us-east-1.rds.amazonaws.com",
            dialect: process.env.DB_DIALECT || "mysql"
        };
        this.sequelize = new Sequelize(DBData.database, DBData.username, DBData.password, {
            host: DBData.host,
            dialect: DBData.dialect
        });
        this.models = new Models(this.sequelize);
    }

    async connect() {
        try {
            await this.sequelize.authenticate();
            console.log('Conexión a la base de datos establecida correctamente.');
        } catch (error) {
            console.error('Error al conectar a la base de datos:', error);
        }
    }

    defineModel(modelName, fields) {
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

module.exports = Database;
