// database.js

const { Sequelize } = require('sequelize');
const Models = require('./models');
const DBThirdModels = require('./dbthirdModels');

class Database {
    constructor(DBName) {
        const DBData = {
            database: DBName || process.env.DB_DATABASE,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST,
            dialect: process.env.DB_DIALECT || "mysql"
        };
        this.sequelize = new Sequelize(DBData.database, DBData.username, DBData.password, {
            host: DBData.host,
            dialect: DBData.dialect
        });
        if (DBData.database === 'db_user') {
            this.models = new Models(this.sequelize);
        }else if (DBData.database === 'db_third') {
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
