import Sequelize from 'sequelize';
import database from '../db.js';

const City = database.define('city', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    cityName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: 'cityName'
    },
    stateCode: {
        type: Sequelize.STRING,
        allowNull: false
    },
    stateName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    cityCode: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: 'cityCode'
    }
})

export default City;