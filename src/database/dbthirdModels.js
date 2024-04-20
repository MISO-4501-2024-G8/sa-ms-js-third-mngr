// models.js

const { DataTypes } = require('sequelize');

class DBThirdModels {
    constructor(sequelize) {
        this.sequelize = sequelize;
    }

    // db_third

    defineThirdProduct() {
        return this.sequelize.define('third_product',
            {
                id: {
                    type: DataTypes.STRING,
                    primaryKey: true,
                    autoIncrement: true
                },
                id_third_user: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                description: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                value: {
                    type: DataTypes.FLOAT,
                    allowNull: false
                },
                typeProduct: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                representative_phone: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
            },
            {
                tableName: 'third_product'
            }
        );
    };

    defineCustomerService() {
        return this.sequelize.define('customer_service',
            {
                id: {
                    type: DataTypes.STRING,
                    primaryKey: true,
                    autoIncrement: true
                },
                id_user: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                id_service: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                user_name: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                user_address: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                user_neighborhood: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                user_phone: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                value: {
                    type: DataTypes.FLOAT,
                    allowNull: false
                },
                service_date: {
                    type: DataTypes.DATE,
                    allowNull: false
                },
            },
            {
                tableName: 'customer_service'
            }
        );
    }

    defineDoctor() {
        return this.sequelize.define('doctor',
            {
                id: {
                    type: DataTypes.STRING,
                    primaryKey: true,
                    autoIncrement: true
                },
                id_third_product: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                address: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                phone: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
            },
            {
                tableName: 'doctor'
            }
        );
    }

    defineTrainer(){
        return this.sequelize.define('trainer',
            {
                id: {
                    type: DataTypes.STRING,
                    primaryKey: true,
                    autoIncrement: true
                },
                id_third_product: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                phone: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
            },
            {
                tableName: 'trainer'
            }
        );
    };

    defineAvailability(){
        return this.sequelize.define('availability',
            {
                id: {
                    type: DataTypes.STRING,
                    primaryKey: true,
                    autoIncrement: true
                },
                id_service_worker: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                day: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                time_start: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                time_end: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
            },
            {
                tableName: 'availability'
            }
        );
    }

    defineConsultation(){
        return this.sequelize.define('consultation',
            {
                id: {
                    type: DataTypes.STRING,
                    primaryKey: true,
                    autoIncrement: true
                },
                id_service_worker: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                id_user: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                consultation_type: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                consultation_date: {
                    type: DataTypes.DATE,
                    allowNull: false
                },
                link: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
            },
            {
                tableName: 'consultation'
            }
        );
    }
}

module.exports = DBThirdModels;
