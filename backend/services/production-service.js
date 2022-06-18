import { parse } from 'csv-parse/sync';
import { Sequelize } from "sequelize";
import fs from 'fs';
import csv from 'csvtojson';
import groupBy from 'group-by-with-sum'

import City from '../models/city.js';
import Production from '../models/production.js';

export default class ProductionService {
    static async fillData(file) {
        await new Promise(async (resolve, reject) => {
            let productions = [];
            const cities = await City.findAll({ attributes: ['cityCode', 'cityName'], logging: false });
            const citiesMap = {};
            for (let city of cities) {
                citiesMap[city.cityName] = city.cityCode;
            }
            await csv()
                .fromStream(fs.createReadStream('data/' + file + '.csv'))
                .subscribe(async function (jsonObj) { //single json object will be emitted for each csv line
                    try {
                        const year = parseFloat(jsonObj['ano']);
                        const cityId = citiesMap[jsonObj['municipio']];
                        const product = jsonObj['produto'];
                        const plantedArea = parseFloat(jsonObj['area_plantada']);
                        const harvestedArea = parseFloat(jsonObj['area_colhida']);
                        const quantity = parseFloat(jsonObj['quantidade']);
                        const value = jsonObj['valor'] === '' ? 0 : parseFloat(jsonObj['valor']);
                        if (value != NaN || quantity != NaN || harvestedArea != NaN || plantedArea != NaN) {
                            productions.push({
                                year: year,
                                product: product,
                                plantedArea: plantedArea,
                                harvestedArea: harvestedArea,
                                quantity: quantity,
                                value: value,
                                cityId: cityId
                            });
                            if (productions.length === 500000) {
                                await Production.bulkCreate(productions, { logging: false });
                                console.log('Criados ' + productions.length);
                                productions = [];
                            }
                        }
                    }
                    catch (err) {
                        console.log(err);
                        reject();
                    }
                });
            await Production.bulkCreate(productions, { logging: false });
            console.log('Criados ' + productions.length);
            resolve();
        });
    }

    static async getStateProductionValues(stateCode) {
        const cities = await City.findAll({ where: { stateCode: stateCode }, attributes: ['cityCode', 'cityName'], logging: false });
        const citiesMap = {};
        for (let city of cities) {
            citiesMap[city.cityCode] = city.cityName;
        }
        const res = await Production.findAll({ where: { cityId: Object.keys(citiesMap), value: { [Sequelize.Op.not]: [NaN, 0] } }, attributes: ['year', ['cityId', 'city'], 'product', 'value'], logging: false });
        for (let i = 0; i < res.length; i++) {
            res[i].dataValues.city = citiesMap[res[i].dataValues.city];
        }
        return res.map(r => r.dataValues);
    }

    static async getStateProductionQuantities(stateCode) {
        const cities = await City.findAll({ where: { stateCode: stateCode }, attributes: ['cityCode', 'cityName'], logging: false });
        const citiesMap = {};
        for (let city of cities) {
            citiesMap[city.cityCode] = city.cityName;
        }
        const res = await Production.findAll({ where: { cityId: Object.keys(citiesMap).map(v => parseFloat(v)), quantity: { [Sequelize.Op.not]: [NaN, 0] } }, attributes: ['year', ['cityId', 'city'], 'product', 'quantity'] });
        for (let i = 0; i < res.length; i++) {
            res[i].dataValues.city = citiesMap[res[i].dataValues.city];
        }
        return res.map(r => r.dataValues);
    }

    static async getStateProductionPlantedArea(stateCode) {
        const cities = await City.findAll({ where: { stateCode: stateCode }, attributes: ['cityCode', 'cityName'], logging: false });
        const citiesMap = {};
        for (let city of cities) {
            citiesMap[city.cityCode] = city.cityName;
        }
        const res = await Production.findAll({ where: { cityId: Object.keys(citiesMap), plantedArea: { [Sequelize.Op.not]: [NaN, 0] } }, attributes: ['year', ['cityId', 'city'], 'product', 'plantedArea'], logging: false });
        for (let i = 0; i < res.length; i++) {
            res[i].dataValues.city = citiesMap[res[i].dataValues.city];
        }
        return res.map(r => r.dataValues);
    }

    static async getStateProductionLostArea(stateCode) {
        const cities = await City.findAll({ where: { stateCode: stateCode }, attributes: ['cityCode', 'cityName'], logging: false });
        const citiesMap = {};
        for (let city of cities) {
            citiesMap[city.cityCode] = city.cityName;
        }
        const res = await Production.findAll({ where: { cityId: Object.keys(citiesMap), plantedArea: { [Sequelize.Op.not]: [NaN, 0] }, harvestedArea: { [Sequelize.Op.not]: [NaN, 0] } }, attributes: ['year', ['cityId', 'city'], 'product', [Sequelize.fn('sum', Sequelize.literal('(plantedArea - harvestedArea)/plantedArea')), 'lostArea']], logging: false });
        for (let i = 0; i < res.length; i++) {
            res[i].dataValues.city = citiesMap[res[i].dataValues.city];
        }
        return res.map(r => r.dataValues);
    }

    static async getStateProductionHarvestedArea(stateCode) {
        const cities = await City.findAll({ where: { stateCode: stateCode }, attributes: ['cityCode', 'cityName'], logging: false });
        const citiesMap = {};
        for (let city of cities) {
            citiesMap[city.cityCode] = city.cityName;
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

    static async getTotalProductionLostAreaByYear(year) {
        const res = await Production.findAll({
            group: ['cityId'],
            where: { year: year, harvestedArea: { [Sequelize.Op.not]: [NaN, 0] }, plantedArea: { [Sequelize.Op.not]: [NaN, 0] } },
            attributes: [
                'cityId',
                [Sequelize.fn('sum', Sequelize.literal('plantedArea')), 'totalPlantedArea'],
                [Sequelize.fn('sum', Sequelize.literal('harvestedArea')), 'totalHarvestedArea']
            ],
            logging: false
        });

        for (let i = 0; i < res.length; i++) {
            res[i].dataValues.lostArea = (res[i].dataValues.totalPlantedArea - res[i].dataValues.totalHarvestedArea) / res[i].dataValues.totalPlantedArea;
            if (res[i].dataValues.lostArea < 0) {
                res[i].dataValues.lostArea = 0;
            }
        }
        return res.map(r => r.dataValues);
    }

    static async getTotalProductionLostAreaByProduct() {
        const res = await Production.findAll({
            group: ['year', 'product'],
            where: { harvestedArea: { [Sequelize.Op.not]: [NaN, 0] }, plantedArea: { [Sequelize.Op.not]: [NaN, 0] } },
            attributes: ['cityId', 'year', 'product', [Sequelize.fn('sum', Sequelize.literal('(plantedArea - harvestedArea)/plantedArea')), 'lostArea']],
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

    static async test() {
        const res = await Production.findAll({
            group: ['year'],
            where: { plantedArea: { [Sequelize.Op.not]: [NaN, 0] } },
            attributes: ['year', [Sequelize.fn('avg', Sequelize.col('plantedArea')), 'plantedArea']],
            logging: false
        });
        return { res: res.map(r => r.plantedArea) };
    }


};