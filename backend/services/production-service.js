import { parse } from 'csv-parse/sync';
import { Sequelize } from "sequelize";
import fs from 'fs';

import City from '../models/city.js';
import Production from '../models/production.js';

export default class ProductionService {
    static async fillData(file) {
        console.log(file);
        await new Promise(async (resolve, reject) => {
            const records = parse(fs.readFileSync('data/' + file + '.csv').toString(), { from_line: 3, delimiter: ';', columns: true });
            let produtos = [];
            for (let record of records) {
                if (!record['Município']) {
                    return;
                }
                try {
                    let keyValue;
                    for (let prop in record) {
                        if (prop.startsWith('Valor da produção (')) {
                            keyValue = prop;
                        }
                    }
                    const year = parseFloat(record['Ano']);
                    const cityName = record['Município'];
                    const product = record['Produto das lavouras temporárias e permanentes'];
                    const plantedArea = parseFloat(record['Área plantada ou destinada à colheita']);
                    const harvestedArea = parseFloat(record['Área colhida (Hectares)']);
                    const quantity = parseFloat(record['Quantidade produzida (Toneladas)']);
                    const value = record[keyValue] === '-' ? 0 : parseFloat(record[keyValue]);
                    const city = await City.findOne({ where: { cityName: cityName }, attributes: ['id'], logging: false });

                    if (value != NaN || quantity != NaN || harvestedArea != NaN || plantedArea != NaN) {
                        produtos.push({
                            year: year,
                            product: product,
                            plantedArea: plantedArea,
                            harvestedArea: harvestedArea,
                            quantity: quantity,
                            value: value,
                            cityId: city.id
                        });
                    }

                }
                catch (err) {
                    console.log(err);
                    reject();
                }
            }
            try {
                console.log('Creating...');
                await Production.bulkCreate(produtos, { logging: false });
            } catch (error) {
                console.log(error);
                reject();
            }
            resolve();
        });
    }

    static async getStateProductionValues(stateCode) {
        const cities = await City.findAll({ where: { stateCode: stateCode }, attributes: ['id', 'cityName'], logging: false });
        const citiesMap = {};
        for (let city of cities) {
            citiesMap[city.id] = city.cityName;
        }
        const res = await Production.findAll({ where: { cityId: Object.keys(citiesMap), value: { [Sequelize.Op.not]: [NaN, 0] } }, attributes: ['year', ['cityId', 'city'], 'product', 'value'], logging: false });
        for (let i = 0; i < res.length; i++) {
            res[i].dataValues.city = citiesMap[res[i].dataValues.city];
        }
        return res.map(r => r.dataValues);
    }

    static async getStateProductionQuantities(stateCode) {
        const cities = await City.findAll({ where: { stateCode: stateCode }, attributes: ['id', 'cityName'], logging: false });
        const citiesMap = {};
        for (let city of cities) {
            citiesMap[city.id] = city.cityName;
        }
        const res = await Production.findAll({ where: { cityId: Object.keys(citiesMap), quantity: { [Sequelize.Op.not]: [NaN, 0] } }, attributes: ['year', ['cityId', 'city'], 'product', 'quantity'], logging: false });
        for (let i = 0; i < res.length; i++) {
            res[i].dataValues.city = citiesMap[res[i].dataValues.city];
        }
        return res.map(r => r.dataValues);
    }

    static async getStateProductionPlantedArea(stateCode) {
        const cities = await City.findAll({ where: { stateCode: stateCode }, attributes: ['id', 'cityName'], logging: false });
        const citiesMap = {};
        for (let city of cities) {
            citiesMap[city.id] = city.cityName;
        }
        const res = await Production.findAll({ where: { cityId: Object.keys(citiesMap), plantedArea: { [Sequelize.Op.not]: [NaN, 0] } }, attributes: ['year', ['cityId', 'city'], 'product', 'plantedArea'], logging: false });
        for (let i = 0; i < res.length; i++) {
            res[i].dataValues.city = citiesMap[res[i].dataValues.city];
        }
        return res.map(r => r.dataValues);
    }

    static async getStateProductionHarvestedArea(stateCode) {
        const cities = await City.findAll({ where: { stateCode: stateCode }, attributes: ['id', 'cityName'], logging: false });
        const citiesMap = {};
        for (let city of cities) {
            citiesMap[city.id] = city.cityName;
        }
        const res = await Production.findAll({ where: { cityId: Object.keys(citiesMap), harvestedArea: { [Sequelize.Op.not]: [NaN, 0] } }, attributes: ['year', ['cityId', 'city'], 'product', 'harvestedArea'], logging: false });
        for (let i = 0; i < res.length; i++) {
            res[i].dataValues.city = citiesMap[res[i].dataValues.city];
        }
        return res.map(r => r.dataValues);
    }

    static async getTotalProductionValueByProduct() {
        const res = await Production.findAll({
            group: ['year', 'product'],
            where: { value: { [Sequelize.Op.not]: [NaN, 0] } },
            attributes: ['year', 'product', [Sequelize.fn('sum', Sequelize.col('value')), 'value']],
            logging: false
        });
        return res.map(r => r.dataValues);
    }

    static async getTotalProductionQuantityByProduct() {
        const res = await Production.findAll({
            group: ['year', 'product'],
            where: { quantity: { [Sequelize.Op.not]: [NaN, 0] } },
            attributes: ['year', 'product', [Sequelize.fn('sum', Sequelize.col('quantity')), 'quantity']],
            logging: false
        });
        return res.map(r => r.dataValues);
    }

    static async getTotalProductionPlantedAreaByProduct() {
        const res = await Production.findAll({
            group: ['year', 'product'],
            where: { plantedArea: { [Sequelize.Op.not]: [NaN, 0] } },
            attributes: ['year', 'product', [Sequelize.fn('sum', Sequelize.col('plantedArea')), 'plantedArea']],
            logging: false
        });
        return res.map(r => r.dataValues);
    }

    static async getTotalProductionHarvestedAreaByProduct() {
        const res = await Production.findAll({
            group: ['year', 'product'],
            where: { harvestedArea: { [Sequelize.Op.not]: [NaN, 0] } },
            attributes: ['year', 'product', [Sequelize.fn('sum', Sequelize.col('harvestedArea')), 'harvestedArea']],
            logging: false
        });
        return res.map(r => r.dataValues);
    }

};