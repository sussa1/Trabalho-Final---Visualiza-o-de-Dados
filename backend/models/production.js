import Sequelize from 'sequelize';
import database from '../db.js';
import City from './city.js';

const Production = database.define('production', {
    cityId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
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

export default Production;