const Sequelize = require('sequelize');
const database = require('../db');
const City = require('./city')

const Production = database.define('production', {
    cityId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: City,
            key: 'id'
        }
    },
    year: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    product: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    plantedArea: Sequelize.DOUBLE,
    harvestedArea: Sequelize.DOUBLE,
    quantity: Sequelize.DOUBLE,
    value: Sequelize.DOUBLE
})

module.exports = Production;