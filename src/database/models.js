// models.js

const { DataTypes } = require('sequelize');

class Models {
    constructor(sequelize) {
        this.sequelize = sequelize;
    }

    defineUser() {
        return this.sequelize.define('user',
            {
                id: {
                    type: DataTypes.STRING,
                    primaryKey: true,
                    autoIncrement: true
                },
                email: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                password: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                doc_num: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                doc_type: {
                    type: DataTypes.STRING(10),
                    allowNull: false
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                phone: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                user_type: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                token: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                expiration_token: {
                    type: DataTypes.DATE,
                    allowNull: true
                }
            },
            {
                tableName: 'user'
            }
        );
    }

    defineThirdUser() {
        return this.sequelize.define('third_user',
            {
                id: {
                    type: DataTypes.STRING,
                    primaryKey: true,
                    autoIncrement: true
                },
                company_creation_date: {
                    type: DataTypes.DATE,
                    allowNull: false
                },
                company_address: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                contact_name: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                company_description: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                company_status: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
            },
            {
                tableName: 'third_user'
            }
        );
    }
}

module.exports = Models;
